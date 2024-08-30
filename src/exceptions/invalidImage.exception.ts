import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidImageException extends HttpException {
    constructor() {
        super({
            error_code: "INVALID_DATA",
            error_description: "Imagem inválida!"
        }, HttpStatus.BAD_REQUEST);
    }

    getResponse(): string | object {
        return {
            error_code: "INVALID_DATA",
            error_description: "Imagem inválida!"
        }
    }
}