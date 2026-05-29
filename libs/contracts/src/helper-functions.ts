import { HttpException, UnauthorizedException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { firstValueFrom } from 'rxjs';

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

const buildMap = async (
    ids: string[],
    pattern: string,
    service: any,
) => {
    const results = await Promise.allSettled(
        ids.map((id) => firstValueFrom(service.send(pattern, id))),
    );

    return results.reduce((map, result) => {
        if (result.status === 'fulfilled') {
            const item: any = result.value;

            if (item?._id) {
                map.set(item._id.toString(), item);
            }
        }

        return map;
    }, new Map<string, any>());
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
    buildMap,
    throwRpcException,
    handleMicroserviceError
}