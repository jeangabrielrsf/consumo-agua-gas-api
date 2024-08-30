import { Injectable } from '@nestjs/common/decorators';
import { UploadFormRequestDTO } from './dtos/uploadForm.dto';
import {isBase64} from "is-base64"
import { InvalidImageException } from './exceptions/invalidImage.exception';
import { GeminiService } from './gemini/gemini.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Measure } from './measures/measures.entity';
import { Repository } from 'typeorm';
import { User } from './users/user.entity';
import { DoubleReportException } from './exceptions/doubleReport.exception';


@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Measure)
    private measuresRepository : Repository<Measure>,
    @InjectRepository(User)
    private usersRepository : Repository<User>,
    private geminiService: GeminiService
  ){}

  async uploadImageTest(uploadFormDto:UploadFormRequestDTO) {
    if(!isBase64(uploadFormDto.image, {allowMime:true})){
      throw new InvalidImageException();
    }

    try {
      const uploadResponse = await this.geminiService.uploadImage(uploadFormDto);
      const result = await this.geminiService.getImageValue(uploadFormDto);

      this.checkMeasure(uploadFormDto);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  async checkMeasure(uploadFormDto: UploadFormRequestDTO) {
    const user = await this.usersRepository.findOneBy({id: uploadFormDto.customer_code});
    const measure = await this.measuresRepository.findOneBy({user});
    console.log("Medida: " +  measure)
  }
}
