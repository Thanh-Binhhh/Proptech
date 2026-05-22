import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountStatus } from './schemas/register.schema';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'node_modules/bcryptjs';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid'
import { MailService } from './mail/mail.service';
import { AuthDb } from './auth-service.db';
import { RegistrationDto } from '@app/contracts/auth/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly authDb: AuthDb,
        private readonly mailService: MailService,
        private readonly jwtService: JwtService
    ) { }

    /*==========================
      REGISTER
    ============================*/
    register = async (request: RegistrationDto) => {
        const isExist = await this.findByEmail(request.email)
        if (isExist)
            throw new ConflictException("Email đã được đăng ký")

        const response = await this.authDb.create({ ...request })
        const { _id, name, email, role, status } = response
        await this.mailService.sendFirstLoginMail(_id, name, email)

        return {
            message: 'Tạo mới tài khoản thành công. Nhân viên vui lòng hoàn thành đăng nhập thông qua email.',
            data: {
                _id,
                name,
                email,
                role,
                status
            }
        }
    }

    /*==========================
     SET PASWORD
   ============================*/
    setupPassword = async (payload) => {
        const auth = await this.authenticate(payload.authorization)
        const response = await this.authDb.findById(auth.sub)
        if (!response)
            throw new BadRequestException('Người dùng không tồn tại.')
        if (response.status === AccountStatus.ACTIVE)
            throw new BadRequestException('Tài khoản đã được kích hoạt.')

        response.hashedPassword = await this.hashPassword(payload.password)
        response.status = AccountStatus.ACTIVE
        await response.save()

        const { _id, name, role } = response
        return {
            message: "Thiết lập tài khoản thành công",
            data: {
                _id,
                name,
                role
            }
        }
    }

    resendEmail = async (request) => {
        var response = await this.authDb.findById(request._id)

        if (!response)
            throw new BadRequestException('ID người dùng không chính xác.')
        const { _id, email } = response
        await this.mailService.sendFirstLoginMail(_id, response.name, email)
        return {
            message: 'Gửi lại email thành công.',
        }
    }

    requestResetPassword = async (request) => {
        const response = await this.findByEmail(request.email)
        if (!response)
            throw new BadRequestException('Tài khoản không tồn tại.')

        const { _id, name, email } = response
        await this.mailService.sendResetPasswordMail(_id, name, email)

        return {
            message: 'Kiểm tra email của bạn để thực hiện đổi mật khẩu.',
        }
    }

    resetPassword = async (payload) => {
        const auth = await this.authenticate(payload.authorization)
        const response = await this.authDb.findById(auth.sub)
        if (!response)
            throw new BadRequestException('Người dùng không tồn tại.')

        response.hashedPassword = await this.hashPassword(payload.body.password)
        await response.save()

        return {
            message: 'Đổi mật khẩu thành công.',
        }
    }

    private authenticate = async (req) => {
        try {
            const token = req.headers?.authorization?.split(' ')[1];

            if (!token) {
                throw new UnauthorizedException('Thiếu token để xác thực.');
            }

            const payload = await this.jwtService.verifyAsync(
                token, {
                secret: process.env.SECRET_KEY
            })
            return payload
        } catch (error) {
            if (error instanceof Error && error.name === 'TokenExpiredError')
                throw new UnauthorizedException('Link đã hết hạn, vui lòng liên hệ với quản trị viên.');
            throw new UnauthorizedException('Token không hợp lệ.')
        }
    }

    private hashPassword = async (password) => {
        return await bcrypt.hash(password, 10)
    }

    private findByEmail = async (request) => {
        return await this.authDb.findByEmail(request)
    }

    /*==========================
      LOG IN
    ============================*/
    logIn = async (payload) => {
        const message = 'Email hoặc mật khẩu không chính xác.'
        const response = await this.findByEmail(payload.body.email)

        if (!response)
            throw new UnauthorizedException(message)

        const { _id, name, email, role, status, hashedPassword } = response
        if (status !== AccountStatus.ACTIVE)
            throw new UnauthorizedException('Tài khoản chưa được kích hoạt.')

        const isValidPassword = await bcrypt.compare(payload.body.password, hashedPassword!)
        if (!isValidPassword)
            throw new UnauthorizedException(message)

        await this.generateTokens(payload.res, _id)

        return {
            message: "Đăng nhập thành công",
            data: {
                _id,
                name,
                email,
                role,
                status
            }
        }
    }

    private generateTokens = async (res, _id) => {
        const payload = { sub: _id }
        const accessToken = await this.jwtService.signAsync(payload)

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000, // 15m
        })

        const refreshToken = uuidv4()
        await this.authDb.storeRefreshToken(
            refreshToken,
            _id,
            dayjs().add(1, 'day')
        )

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 1d
        })
    }

    refreshTokens = async (payload) => {
        const refreshToken = payload.req.cookies?.refresh_token ?? null;
        if (!refreshToken) {
            throw new UnauthorizedException('Thiếu token để xác thực.');
        }

        const response = await this.authDb.findRefreshToken(refreshToken)
        if (!response || response.refreshToken !== refreshToken)
            throw new UnauthorizedException('Token không hợp lệ')

        await this.generateTokens(payload.res, response.accountId)
        return {
            message: 'Cấp mới token thành công'
        }
    }

    /*==========================
      QUERY ACCOUNTS
    ============================*/
    find = async () => {
        const response = await this.authDb.find()
        return {
            message: 'Lấy danh sách nhân viên thành công',
            data: response
        }
    }
}