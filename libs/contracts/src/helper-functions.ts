import { HttpException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

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
    throwRpcException,
    handleMicroserviceError
}