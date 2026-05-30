import { Controller } from '@nestjs/common';
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
      token?: string,
      request: SetupPasswordDto
    }
  ) {
    return await this.authService.setupPassword(payload.token, payload.request)
  }

  @MessagePattern(AUTH_PATTERNS.RESEND_EMAIL)
  async resend(
    @Payload() request: ResendDto
  ) {
    return await this.authService.resendEmail(request)
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  async logIn(
    @Payload() request: LogInDto
  ) {
    return await this.authService.logIn(request)
  }

  @MessagePattern(AUTH_PATTERNS.REFRESH_TOKEN)
  async refreshTokens(
    @Payload() request: string) {
    return await this.authService.refreshTokens(request)
  }

  @MessagePattern(AUTH_PATTERNS.ME)
  async getMe(
    @Payload() payload: {
      accessToken?: string
    }) {
    return await this.authService.getMe(payload.accessToken)
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
      token?: string,
      request: ResetPasswordDto
    }
  ) {
    return await this.authService.resetPassword(payload.token, payload.request)
  }

  @MessagePattern(AUTH_PATTERNS.FIND)
  async find() {
    return await this.authService.find()
  }

  @MessagePattern(AUTH_PATTERNS.FIND_ONE)
  async findOneForContactService(@Payload() payload: {
    _id: string
  }) {
    return await this.authService.findOne(payload)
  }
}