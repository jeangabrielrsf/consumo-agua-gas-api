import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { UploadFormRequestDTO } from './dtos/uploadForm.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  


  @Post("/upload")
  postUploadImage(@Body() uploadFormDto: UploadFormRequestDTO) {

    return this.appService.uploadImageTest(uploadFormDto);
  }
}
