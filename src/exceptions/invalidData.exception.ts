import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidDataException extends HttpException {
    constructor() {
        super({
            error_code: "INVALID_DATA",
            error_description: "Dados fornecidos no corpo da requisição são inválidos"
        }, HttpStatus.BAD_REQUEST);
    }

    getResponse(): string | object {
        return {
            error_code: "INVALID_DATA",
            error_description: "Dados fornecidos no corpo da requisição são inválidos"
        }
    }
}