import { IsNumber, IsUUID } from "class-validator";

export class ConfirmBodyDTO {
    @IsUUID()
    measure_uuid: string ;

    @IsNumber()
    confirmed_value: number;
}