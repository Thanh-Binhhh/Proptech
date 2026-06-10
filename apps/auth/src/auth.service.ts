import { AccountStatus } from './schemas/register.schema';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'node_modules/bcryptjs';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid'
import { MailService } from './mail/mail.service';
import { AuthDb } from './auth.db';
import { RegistrationDto } from '@app/contracts/auth/register.dto';
import { Injectable } from '@nestjs/common';
import { throwRpcException } from '@app/contracts/helper-functions';

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
            return throwRpcException(409, "Email đã được đăng ký")

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
                return throwRpcException(404, 'Người dùng không tồn tại.')
            if (response.status === AccountStatus.ACTIVE)
                return throwRpcException(409, 'Tài khoản đã được kích hoạt.')

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
                return throwRpcException(401, 'Token đã hết hạn.')
            return throwRpcException(401, 'Token không hợp lệ.')
        }
    }

    resendEmail = async (request) => {
        var response = await this.authDb.findById(request._id)

        if (!response)
            return throwRpcException(404, 'ID người dùng không chính xác.')
        if (response.status !== AccountStatus.PENDING_FIRST_LOGIN)
            return throwRpcException(409, 'Tài khoản đã được kích hoạt lần đầu.')

        const { _id, email } = response
        await this.mailService.sendFirstLoginMail(_id, response.name, email)
        return {
            message: 'Gửi lại email thành công.',
        }
    }

    requestResetPassword = async (request) => {
        const response = await this.findByEmail(request.email)
        if (!response)
            return throwRpcException(404, 'Tài khoản không tồn tại.')

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
                return throwRpcException(404, 'Người dùng không tồn tại.')

            response.hashedPassword = await this.hashPassword(request.password)
            await response.save()

            return {
                message: 'Đổi mật khẩu thành công.',
            }
        } catch (error) {
            const err = error as Error
            if (err.name === 'TokenExpiredError')
                return throwRpcException(401, 'Token đã hết hạn.')
            return throwRpcException(401, 'Token không hợp lệ.')
        }
    }

    /*==========================
      LOG IN
    ============================*/
    logIn = async (request) => {
        const message = 'Email hoặc mật khẩu không chính xác.'
        const response = await this.findByEmail(request.email)

        if (!response)
            return throwRpcException(401, message)

        const { _id, name, email, role, status, hashedPassword } = response
        if (status !== AccountStatus.ACTIVE)
            return throwRpcException(409, 'Tài khoản chưa được kích hoạt.')

        const isValidPassword = await bcrypt.compare(request.password, hashedPassword!)
        if (!isValidPassword)
            return throwRpcException(401, message)

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
            return throwRpcException(401, 'Token không hợp lệ')

        const tokens = await this.generateTokens(response.accountId, response.role)

        return {
            message: 'Cấp mới token thành công',
            tokens
        }
    }

    getMe = async (sub) => {
        const response = await this.authDb.findById(sub)

        const { _id, name, email, role, status } = response
        return {
            message: 'Truy vấn thông tin tài khoản thành công',
            data: {
                _id,
                name,
                email,
                role,
                status
            }
        }
    }

    logOut = async (token) => {
        if (token)
            await this.authDb.deleteRefreshToken(token)

        return {
            message: 'Đã xóa refresh token trong Cookie.',
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

    findOne = async (payload) => {
        const { _id } = payload
        const response = await this.authDb.findById(_id)

        return {
            _id: response!._id,
            name: response!.name,
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
}