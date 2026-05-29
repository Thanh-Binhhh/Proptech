import { HttpException, UnauthorizedException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

const getTokenFromCookies = async (req, type = 'refresh') => {
    try {
        const token =
            type === 'access'
                ? req.cookies?.access_token ?? null
                : req.cookies?.refresh_token ?? null;

        if (!token)
            throw new UnauthorizedException('Thiếu token để xác thực.');
        return token
    } catch (error) {
        if (error instanceof Error && error.name === 'TokenExpiredError')
            throw new UnauthorizedException('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
        throw new UnauthorizedException('Token không hợp lệ.')
    }
}

const getTokenFromHeaders = async (req) => {
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

const throwRpcException = (statusCode, message): never => {
    throw new RpcException({
        statusCode,
        message
    })
}

const handleMicroserviceError = (error) => {
    type MicroserviceError = {
        statusCode?: number;
        message?: string;
    };

    const err = error as MicroserviceError;

    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? 'Đã có lỗi xảy ra!';
    throw new HttpException(message, statusCode);
}

export {
    getTokenFromCookies,
    getTokenFromHeaders,
    throwRpcException,
    handleMicroserviceError
}