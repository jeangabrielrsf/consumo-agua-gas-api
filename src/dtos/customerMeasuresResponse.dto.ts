type MeasureResponse = {
    measure_uuid: string;
    measure_type: string;
    measure_datetime: Date;
    has_confirmed: boolean;
    image_url: string;
    measure_value:number;
}

export class CustomerMeasuresResponse {
    customer_code: string;
    measures: MeasureResponse[];
}