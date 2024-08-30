import { HttpException, HttpStatus } from "@nestjs/common";

export class DoubleReportException extends HttpException {
    constructor() {
        super({
            error_code: "DOUBLE_REPORT",
            error_description: "Leitura do mês já realizada",
        }, HttpStatus.CONFLICT);
    }

    getResponse(): string | object {
        return {
            error_code: "DOUBLE_REPORT",
            error_description: "Leitura do mês já realizada",
        }
    }
}