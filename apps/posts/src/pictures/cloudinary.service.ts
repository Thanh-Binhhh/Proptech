import { Inject, Injectable } from "@nestjs/common";
import { v2 as Cloudinary } from 'cloudinary';

export type UploadedImageResult = {
    url: string;
    publicId: string;
};

@Injectable()
export class CloudinaryService {
    constructor(
        @Inject('CLOUDINARY')
        private readonly cloudinary: typeof Cloudinary,
    ) { }

    upload = async (picture): Promise<UploadedImageResult> => {
        const buffer = Buffer.from(picture.buffer.data ?? picture.buffer);

        return new Promise((resolve, reject) => {
            const stream = this.cloudinary.uploader.upload_stream(
                {
                    folder: process.env.CLOUDINARY_FOLDER,
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Không thể lưu trữ ảnh bài đăng.'));

                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                },
            );

            stream.end(buffer);
        });
    };

    delete = async (publicId) => {
        return this.cloudinary.uploader.destroy(publicId, {
            resource_type: 'image',
        });
    };
}