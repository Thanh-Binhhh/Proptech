import { HttpException } from "@nestjs/common";

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
    handleMicroserviceError
}