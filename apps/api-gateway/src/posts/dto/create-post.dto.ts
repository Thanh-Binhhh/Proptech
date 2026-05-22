export class CreatePostDto {
    // @IsString()
    // @IsNotEmpty()
    htmlSource!: string

    // @IsObject()
    // @IsNotEmpty()
    jsonSource!: Record<string, any>
}
