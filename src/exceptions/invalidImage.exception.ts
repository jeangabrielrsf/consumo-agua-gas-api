import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidImageException extends HttpException {
    constructor() {
        super('BadRequest', HttpStatus.BAD_REQUEST);
    }
}