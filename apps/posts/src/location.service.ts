// import { throwRpcException } from '@app/contracts/helper-functions';
// import { BadRequestException, Injectable } from '@nestjs/common';
// import axios from 'axios';
// import { Region } from './schemas/posts.schema';

// @Injectable()
// export class LocationService {
//     private readonly ollamaUrl = process.env.OLLAMA_URL || 'http://ollama:11434/api/generate';
//     private readonly model = process.env.OLLAMA_MODEL;

//     extractRegionFromAddress = async (address: string) => {
//         const prompt = `
//             Bạn là hệ thống xử lý địa chỉ bất động sản tại Việt Nam.
//             Hãy đọc địa chỉ sau và trả về JSON hợp lệ.

//             Yêu cầu:
//             - Xác định miền: Miền Bắc, Miền Trung, Miền Nam.
//             - Không giải thích ngoài JSON.

//             Schema:
//             {
//                 "region": "Miền Bắc | Miền Trung | Miền Nam",
//             }

//             Địa chỉ:
//             "${address}"
//             `.trim();

//         const response = await axios.post(this.ollamaUrl, {
//             model: this.model,
//             prompt,
//             stream: false,
//             format: 'json',
//         });

//         const raw = response.data?.response;

//         if (!raw) {
//             return throwRpcException(
//                 400,
//                 'Không thể trích xuất ra vùng miền từ địa chỉ bất động sản.',
//             );
//         }

//         const parsed = JSON.parse(raw);

//         if (![Region.NORTH, Region.CENTRAL, Region.SOUTH].includes(parsed.region)) {
//             throw new BadRequestException('Kết quả trả về vùng miền không hợp lệ.');
//         }

//         return parsed as {
//             region: Region;
//         };
//     }
// }