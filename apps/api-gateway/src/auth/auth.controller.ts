import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Guard } from '../guards/auth.guard';
import { Public } from '../guards/public.decorater';
import { RegistrationDto } from '@app/contracts/auth/register.dto';
import { SetupPasswordDto } from '@app/contracts/auth/setup-password.dto';
import { ResetPasswordDto } from '@app/contracts/auth/forgot-password.dto';
import { ResendDto } from '@app/contracts/auth/resend.dto';
import { LogInDto } from '@app/contracts/auth/login.dto';

@UseGuards(Guard)
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(
        @Body() request: RegistrationDto
    ) {
        return await this.authService.register(request)
    }

    @Public()
    @Post('setup')
    async setupPassword(
        @Req() req: Request,
        @Body() request: SetupPasswordDto
    ) {
        return await this.authService.setup(req, request)
    }

    @Post('resend')
    async resend(
        @Body() request: ResendDto
    ) {
        return await this.authService.resend(request)
    }

    @Public()
    @Post('login')
    async logIn(
        @Body() request: LogInDto,
        @Res({ passthrough: true }) res: Response) {
        return await this.authService.login(request, res)
    }

    @Public()
    @Post('refresh')
    async refreshTokens(
        @Req() req: any,
        @Res({ passthrough: true }) res: Response
    ) {
        return await this.authService.refresh(req, res)
    }

    @Public()
    @Post('request-reset-password')
    async requestResetPassword(
        @Body() request: ResetPasswordDto
    ) {
        return await this.authService.request(request)
    }

    @Public()
    @Post('reset-password')
    async resetPassword(
        @Req() req: Request,
        @Body() request: SetupPasswordDto
    ) {
        return await this.authService.reset(req, request)
    }

    @Get()
    async find() {
        return await this.authService.find()
    }
}