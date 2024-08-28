import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { UploadFormRequestDTO } from './utils/uploadForm.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/upload")
  postUploadImage(@Body() uploadFormDto: UploadFormRequestDTO) {

    return this.appService.uploadImage();
  }
}
