import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { UploadFormRequestDTO } from './dtos/uploadForm.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Post("/upload")
  @HttpCode(200)
  postUploadImage(@Body() uploadFormDto: UploadFormRequestDTO) {

    return this.appService.uploadImageTest(uploadFormDto);
  }
}
