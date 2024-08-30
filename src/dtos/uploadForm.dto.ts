import { IsISO8601, IsNotEmpty, IsString, IsUUID } from "class-validator";

export enum MeasureType {
    WATER = "WATER",
    GAS = "GAS"
}

export class UploadFormRequestDTO {
    @IsString()
    image: string;

    @IsUUID()
    customer_code: string;

    @IsISO8601()
    measure_datetime: Date;

    @IsNotEmpty()
    measure_type: MeasureType;
}