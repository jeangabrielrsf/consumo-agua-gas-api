import { HttpException, HttpStatus } from "@nestjs/common";

export class DoubleReportException extends HttpException {
    constructor() {
        super({
            error_code: "MEASURE_NOT_FOUND",
            error_description: "Leitura do mês já realizada",
        }, HttpStatus.NOT_FOUND);
    }

    getResponse(): string | object {
        return {
            error_code: "MEASURE_NOT_FOUND",
            error_description: "Leitura do mês já realizada",
        }
    }
}