import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidMeasureTypeException extends HttpException {
    constructor() {
        super({
            error_code: "INVALID_TYPE",
            error_description: "Tipo de medição não permitida"
        }, HttpStatus.BAD_REQUEST);
    }

    getResponse(): string | object {
        return {
            error_code: "INVALID_TYPE",
            error_description: "Tipo de medição não permitida"
        }
    }
}