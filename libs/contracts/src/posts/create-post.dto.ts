// import {
//     IsNotEmpty,
//     IsObject,
//     IsString
// }
//     from 'class-validator'

export class CreatePostDto {
    // @IsString()
    // @IsNotEmpty()
    htmlSource!: string

    // @IsObject()
    // @IsNotEmpty()
    jsonSource!: Record<string, any>
}