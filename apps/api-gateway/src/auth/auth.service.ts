import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUTH } from '../../../../libs/contracts/constant';
import { AUTH_PATTERNS } from '@app/contracts/auth/auth.patterns';
import { getTokenFromCookies, getTokenFromHeaders, handleMicroserviceError } from '@app/contracts/helper-functions';

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
            const token = await getTokenFromHeaders(req)
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
            const refreshToken = await getTokenFromCookies(req)

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
            const accessToken = await getTokenFromCookies(req, 'access')
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
            const token = await getTokenFromHeaders(req)
            return this.authService.send(AUTH_PATTERNS.RESET_PASSWORD, { token, request })
        } catch (error) {
            handleMicroserviceError(error);
        }
    }

    find = async () => {
        try {
            const response = await firstValueFrom(
                this.authService.send(AUTH_PATTERNS.FIND, {})
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
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 60 * 1000, // 15m
        })

        res.cookie('refresh_token', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000, // 1d
        })
    }
}