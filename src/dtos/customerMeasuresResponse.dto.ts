import { Measure } from "src/measures/measures.entity";

export class CustomerMeasuresResponse {
    customer_code: string;
    measures: Measure[];
}