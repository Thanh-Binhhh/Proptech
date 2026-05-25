import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUTH } from '../constant';
import { AUTH_PATTERNS } from '@app/contracts/auth/auth.patterns';
import { handleMicroserviceError } from '@app/contracts/helper-functions';

@Injectable()
export class AuthService {
    constructor(
        @Inject(AUTH)
        private readonly authService: ClientProxy
    ) { }

    register = async (request) => {
        try {
            return this.authService.send(AUTH_PATTERNS.REGISTER, request)
        } catch (error) {
            handleMicroserviceError(error)
        }
    }

    setup = async (req, request) => {
        try {
            const token = await this.getTokenFromHeaders(req)
            const response = await firstValueFrom(
                this.authService.send(AUTH_PATTERNS.SETUP_PASSWORD, { token, request })
            )
            return response
        } catch (error) {
            handleMicroserviceError(error)
        }
    }

    resend = async (request) => {
        try {
            const response = await firstValueFrom(
                this.authService.send(AUTH_PATTERNS.RESEND_EMAIL, request)
            )
            return response
        } catch (error) {
            handleMicroserviceError(error);
        }
    }

    login = async (request, res) => {
        try {
            const response = await firstValueFrom(
                this.authService.send(AUTH_PATTERNS.LOGIN, request)
            );
            const { message, tokens, data } = response

            await this.setTokens(tokens, res)
            return { message, data }
        } catch (error) {
            handleMicroserviceError(error);
        }

    }

    refresh = async (req, res) => {
        try {
            const refreshToken = await this.getTokenFromCookies(req)

            const response = await firstValueFrom(
                this.authService.send(AUTH_PATTERNS.REFRESH_TOKEN, refreshToken)
            );

            const { message, tokens } = response
            await this.setTokens(tokens, res)
            return { message }
        } catch (error) {
            handleMicroserviceError(error);
        }
    }

    getMe = async (req) => {
        try {
            const accessToken = await this.getTokenFromCookies(req, 'access')
            const response = await firstValueFrom(
                this.authService.send(AUTH_PATTERNS.ME, { accessToken })
            )
            return response
        } catch (error) {
            handleMicroserviceError(error)
        }
    }

    request = async (request) => {
        try {
            return this.authService.send(AUTH_PATTERNS.REQUEST_RESET_PASSWORD, request)
        } catch (error) {
            handleMicroserviceError(error);
        }
    }

    reset = async (req, request) => {
        try {
            const token = await this.getTokenFromHeaders(req)
            return this.authService.send(AUTH_PATTERNS.RESET_PASSWORD, { token, request })
        } catch (error) {
            handleMicroserviceError(error);
        }
    }

    find = async () => {
        try {
            const response = await firstValueFrom(
                this.authService.send(AUTH_PATTERNS.FIND_ACCOUNTS, {})
            )
            return response
        } catch (error) {
            handleMicroserviceError(error);
        }
    }

    /*==========================
      HELPER FUNCTIONS
    ============================*/
    private setTokens = async (tokens, res) => {
        res.cookie('access_token', tokens.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000, // 15m
        })

        res.cookie('refresh_token', tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1d
        })
    }

    private getTokenFromCookies = async (req, type = 'refresh') => {
        try {
            const token =
                type === 'access'
                    ? req.cookies?.access_token ?? null
                    : req.cookies?.refresh_token ?? null;

            if (!token)
                throw new UnauthorizedException('Thiếu refresh token để xác thực.');
            return token
        } catch (error) {
            if (error instanceof Error && error.name === 'TokenExpiredError')
                throw new UnauthorizedException('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
            throw new UnauthorizedException('Refresh token không hợp lệ.')
        }
    }

    private getTokenFromHeaders = async (req) => {
        try {
            const token = req.headers?.authorization?.split(' ')[1];

            if (!token)
                throw new UnauthorizedException('Thiếu token để xác thực.');
            return token
        } catch (error) {
            if (error instanceof Error && error.name === 'TokenExpiredError')
                throw new UnauthorizedException('Link đã hết hạn, vui lòng liên hệ với quản trị viên.');
            throw new UnauthorizedException('Token không hợp lệ.')
        }
    }
}