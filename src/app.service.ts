import { Injectable } from '@nestjs/common/decorators';
import { UploadFormRequestDTO } from './utils/uploadForm.dto';
import {isBase64} from "is-base64"
import { InvalidImageException } from './exceptions/invalidImage.exception';


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  uploadImageTest(uploadFormDto:UploadFormRequestDTO) {
    if(!isBase64(uploadFormDto.image, {allowMime:true})){
      throw new InvalidImageException();
    }
  }
}
