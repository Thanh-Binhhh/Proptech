import { AccountStatus } from './schemas/register.schema';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'node_modules/bcryptjs';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid'
import { MailService } from './mail/mail.service';
import { AuthDb } from './auth.db';
import { RegistrationDto } from '@app/contracts/auth/register.dto';
import { RpcException } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';

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
            return this.throwRpcException(409, "Email đã được đăng ký")

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
    setupPassword = async (token, request) => {
        try {
            const payload = await this.jwtService.verifyAsync(
                token, {
                secret: process.env.SECRET_KEY
            })

            const response = await this.authDb.findById(payload.sub)
            if (!response)
                return this.throwRpcException(404, 'Người dùng không tồn tại.')
            if (response.status === AccountStatus.ACTIVE)
                return this.throwRpcException(409, 'Tài khoản đã được kích hoạt.')

            response.hashedPassword = await this.hashPassword(request.password)
            response.status = AccountStatus.ACTIVE
            await response.save()

            const { _id, name, email, role } = response
            return {
                message: "Thiết lập tài khoản thành công",
                data: {
                    _id,
                    name,
                    email,
                    role
                }
            }
        } catch (error) {
            const err = error as Error
            if (err.name === 'TokenExpiredError')
                return this.throwRpcException(401, 'Token đã hết hạn.')
            return this.throwRpcException(401, 'Token không hợp lệ.')
        }
    }

    resendEmail = async (request) => {
        var response = await this.authDb.findById(request._id)

        if (!response)
            return this.throwRpcException(404, 'ID người dùng không chính xác.')
        const { _id, email } = response
        await this.mailService.sendFirstLoginMail(_id, response.name, email)
        return {
            message: 'Gửi lại email thành công.',
        }
    }

    requestResetPassword = async (request) => {
        const response = await this.findByEmail(request.email)
        if (!response)
            return this.throwRpcException(404, 'Tài khoản không tồn tại.')

        const { _id, name, email } = response
        await this.mailService.sendResetPasswordMail(_id, name, email)

        return {
            message: 'Kiểm tra email của bạn để thực hiện đổi mật khẩu.',
        }
    }

    resetPassword = async (token, request) => {
        try {
            const payload = await this.jwtService.verifyAsync(
                token, {
                secret: process.env.SECRET_KEY
            })
            const response = await this.authDb.findById(payload.sub)
            if (!response)
                return this.throwRpcException(404, 'Người dùng không tồn tại.')

            response.hashedPassword = await this.hashPassword(request.password)
            await response.save()

            return {
                message: 'Đổi mật khẩu thành công.',
            }
        } catch (error) {
            const err = error as Error
            if (err.name === 'TokenExpiredError')
                return this.throwRpcException(401, 'Token đã hết hạn.')
            return this.throwRpcException(401, 'Token không hợp lệ.')
        }
    }

    /*==========================
      LOG IN
    ============================*/
    logIn = async (request) => {
        const message = 'Email hoặc mật khẩu không chính xác.'
        const response = await this.findByEmail(request.email)

        if (!response)
            return this.throwRpcException(401, message)

        const { _id, name, email, role, status, hashedPassword } = response
        if (status !== AccountStatus.ACTIVE)
            return this.throwRpcException(409, 'Tài khoản chưa được kích hoạt.')

        const isValidPassword = await bcrypt.compare(request.password, hashedPassword!)
        if (!isValidPassword)
            return this.throwRpcException(401, message)

        const tokens = await this.generateTokens(_id, role)

        return {
            message: "Đăng nhập thành công.",
            tokens,
            data: {
                _id,
                name,
                email,
                role,
                status
            }
        }
    }

    refreshTokens = async (request) => {
        const response = await this.authDb.findRefreshToken(request)
        if (!response || response.refreshToken !== request)
            return this.throwRpcException(401, 'Token không hợp lệ')

        const tokens = await this.generateTokens(response.accountId, response.role)

        return {
            message: 'Cấp mới token thành công',
            tokens
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

    /*==========================
      HELPER FUNCTIONS
    ============================*/
    private generateTokens = async (_id, role) => {
        const payload = { sub: _id, role }
        const accessToken = await this.jwtService.signAsync(payload)

        const refreshToken = uuidv4()
        await this.authDb.storeRefreshToken(
            refreshToken,
            _id,
            role,
            dayjs().add(1, 'day')
        )
        return { accessToken, refreshToken }
    }

    private hashPassword = async (password) => {
        return await bcrypt.hash(password, 10)
    }

    private findByEmail = async (request) => {
        return await this.authDb.findByEmail(request)
    }

    private throwRpcException = (statusCode, message): never => {
        throw new RpcException({
            statusCode,
            message
        })
    }
}