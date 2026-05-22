import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_PATTERNS } from '@app/contracts/auth/auth.patterns';
import { RegistrationDto } from '../../../libs/contracts/src/auth/register.dto';
import { SetupPasswordDto } from '@app/contracts/auth/setup-password.dto';
import { ResendDto } from '@app/contracts/auth/resend.dto';
import { LogInDto } from '@app/contracts/auth/login.dto';
import { ResetPasswordDto } from '@app/contracts/auth/forgot-password.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  async register(
    @Payload() request: RegistrationDto
  ) {
    return await this.authService.register(request)
  }

  @MessagePattern(AUTH_PATTERNS.SETUP_PASSWORD)
  async setupPassword(
    @Payload() payload: {
      authorization?: string,
      body: SetupPasswordDto
    }
  ) {
    return await this.authService.setupPassword(payload)
  }

  @MessagePattern(AUTH_PATTERNS.RESEND_EMAIL)
  async resend(
    @Payload() request: ResendDto
  ) {
    return await this.authService.resendEmail(request)
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  async logIn(
    @Payload() payload: {
      body: LogInDto,
      res
    }
  ) {
    return await this.authService.logIn(payload)
  }

  @MessagePattern(AUTH_PATTERNS.REFRESH_TOKEN)
  async refreshTokens(
    @Payload() payload: {
      req,
      res
    }
  ) {
    return await this.authService.refreshTokens(payload)
  }

  @MessagePattern(AUTH_PATTERNS.REQUEST_RESET_PASSWORD)
  async requestResetPassword(
    @Payload() request: ResetPasswordDto
  ) {
    return await this.authService.requestResetPassword(request)
  }

  @MessagePattern(AUTH_PATTERNS.RESET_PASSWORD)
  async resetPassword(
    @Payload() payload: {
      authorization?: string,
      body: ResetPasswordDto
    }
  ) {
    return await this.authService.resetPassword(payload)
  }

  @Get()
  async find() {
    return await this.authService.find()
  }
}
