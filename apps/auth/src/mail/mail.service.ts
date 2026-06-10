import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly jwtService: JwtService
    ) { }

    sendFirstLoginMail = async (_id, name, email) => {
        const token = await this.generateToken(_id)
        const url = `${process.env.FE_PUBLIC_URL}/auth/setup-password?token=${token}`

        await this.mailerService.sendMail({
            to: email,
            subject: 'Chào mừng bạn đến với Proptech. Vui lòng hoàn tất đăng nhập lần đầu.',
            template: 'register',
            context: {
                name: name,
                firstLoginUrl: url
            },
        });
    }

    sendResetPasswordMail = async (_id, name, email) => {
        const token = await this.generateToken(_id)
        const url = `${process.env.FE_PUBLIC_URL}/auth/reset-password?token=${token}`

        await this.mailerService.sendMail({
            to: email,
            subject: 'Yêu cầu đặt lại mật khẩu',
            template: 'reset-password',
            context: {
                name: name,
                resetPasswordUrl: url
            },
        });
    }

    private generateToken = async (_id) => {
        const payload = { sub: _id }
        const token = await this.jwtService.signAsync(
            payload,
            {
                secret: process.env.SECRET_KEY,
                expiresIn: '15m'
            })

        return token
    }
}