import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { UploadFormRequestDTO } from './dtos/uploadForm.dto';
import { ConfirmBodyDTO } from './dtos/confirmBody.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Post("/upload")
  @HttpCode(HttpStatus.OK)
  postUploadImage(@Body() uploadFormDto: UploadFormRequestDTO) {

    return this.appService.uploadImageTest(uploadFormDto);
  }

  @Patch("/confirm")
  @HttpCode(HttpStatus.OK)
  confirmMeasure(@Body() confirmBody : ConfirmBodyDTO) {
    return this.appService.confirmMeasure(confirmBody);
  }

  @Get("/:customer_code/list")
  @HttpCode(HttpStatus.OK)
  getCustomerMeasures(
    @Param('customer_code', ParseUUIDPipe) customer_code: string,
    @Query('measure_type') measure_type: string
  ) {
    return this.appService.retrieveCustomerMeasures(customer_code, measure_type);
  }
}
