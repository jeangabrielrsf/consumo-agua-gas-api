import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req } from '@nestjs/common';
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
}
