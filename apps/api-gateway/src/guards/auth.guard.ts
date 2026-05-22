import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from 'express';
import { Reflector } from "@nestjs/core";
import { PUBLIC_KEY } from "./public.decorater";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class Guard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) return true;

        const message = 'Không thể xác thực người dùng'
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromCookie(request);

        if (!token)
            throw new UnauthorizedException(message)

        try {
            const payload = await this.jwtService.verifyAsync(token)
            request['accountId'] = payload.sub;
        } catch (error) {
            throw new UnauthorizedException(message)
        }
        return true
    }

    private extractTokenFromCookie = (request: Request) => {
        return request.cookies?.access_token ?? null;
    }
}