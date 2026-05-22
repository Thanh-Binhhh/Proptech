import { Inject, Injectable } from '@nestjs/common';
import { AUTH } from '../constant';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_PATTERNS } from '@app/contracts/auth/auth.patterns';

@Injectable()
export class AuthService {
    constructor(
        @Inject(AUTH)
        private readonly authService: ClientProxy
    ) { }

    register = async (request) => {
        return this.authService.send(AUTH_PATTERNS.REGISTER, request)
    }

    setup = async (req, request) => {
        const payload = {
            authorization: req.headers.authorization,
            Body: request
        }
        return this.authService.send(AUTH_PATTERNS.SETUP_PASSWORD, payload)
    }

    resend = async (request) => {
        return this.authService.send(AUTH_PATTERNS.RESEND_EMAIL, request)
    }

    login = async (request, res) => {
        const payload = {
            Body: request,
            res
        }
        return this.authService.send(AUTH_PATTERNS.LOGIN, payload)
    }

    refresh = async (req, res) => {
        const payload = {
            authorization: req.headers.authorization,
            res
        }
        return this.authService.send(AUTH_PATTERNS.REFRESH_TOKEN, payload)
    }

    request = async (request) => {
        return this.authService.send(AUTH_PATTERNS.REQUEST_RESET_PASSWORD, request)
    }

    reset = async (req, request) => {
        const payload = {
            authorization: req.headers.authorization,
            Body: request
        }
        return this.authService.send(AUTH_PATTERNS.RESET_PASSWORD, payload)
    }

    find = async () => {
        return this.authService.send(AUTH_PATTERNS.FIND_ACCOUNTS, null)
    }
}