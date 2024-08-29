import { HttpException, HttpStatus } from "@nestjs/common";

export class DoubleReportException extends HttpException {
    constructor() {
        super('Double Report', HttpStatus.CONFLICT);
    }
}