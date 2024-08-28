import { IsBase64, IsDate, IsNotEmpty, IsString } from "class-validator";

export class UploadFormRequestDTO {
    @IsBase64()
    image: string;

    @IsString()
    customer_code: string;

    @IsDate()
    measure_datetime: Date;

    @IsNotEmpty()
    measure_type: string;
}