// import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { Observable } from "rxjs";

// @Injectable()
// export class RoleGuard implements CanActivate {
//     constructor(private roles: string[]) { }

//     canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//         const request = context.switchToHttp().getRequest()
//         return this.roles.includes(request.user.role)
//     }
// }

// role.guard.ts
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './decorator/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const hasRole = requiredRoles.includes(request.user.role);

        if (!hasRole) {
            throw new ForbiddenException('Bạn không có quyền truy cập.');
        }
        return true;
    }
}