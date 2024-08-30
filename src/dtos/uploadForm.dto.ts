import { IsISO8601, IsNotEmpty, IsString } from "class-validator";

export class UploadFormRequestDTO {
    @IsString()
    image: string;

    @IsString()
    customer_code: string;

    @IsISO8601()
    measure_datetime: Date;

    @IsNotEmpty()
    measure_type: string;
}