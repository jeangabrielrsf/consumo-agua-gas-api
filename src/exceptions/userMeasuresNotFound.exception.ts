import { HttpException, HttpStatus } from "@nestjs/common";

export class UserMeasuresNotFoundException extends HttpException {
    constructor() {
        super({
            error_code: "MEASURES_NOT_FOUND",
            error_description: "Nenhuma leitura encontrada",
        }, HttpStatus.NOT_FOUND);
    }

    getResponse(): string | object {
        return {
            error_code: "MEASURE_NOT_FOUND",
            error_description: "Nenhuma leitura encontrada",
        }
    }
}