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
import { UploadResponseDTO } from './dtos/uploadResponse.dto';


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
      console.log(uploadResponse);
      const result = await this.geminiService.getImageValue(uploadFormDto);
      console.log(result);

      const user = await this.usersRepository.findOneBy({id: uploadFormDto.customer_code});
      let newMeasure = new Measure();
      newMeasure.image_url = uploadResponse.file.uri;
      newMeasure.has_confirmed = false;
      newMeasure.measure_datetime = uploadFormDto.measure_datetime;
      newMeasure.user = user;
      newMeasure.measure_type = uploadFormDto.measure_type;
      newMeasure.measure_value = parseInt(result);

      console.log(newMeasure);

      await this.measuresRepository.save(newMeasure);

      let response = new UploadResponseDTO();
      response.image_url = newMeasure.image_url;
      response.measure_uuid = newMeasure.id;
      response.measure_value = newMeasure.measure_value;

      return response;
  
    } catch (error) {
      console.log(error);
    }
  }

  async checkMeasure(uploadFormDto: UploadFormRequestDTO) {
    const user = await this.usersRepository.findOneBy({id: uploadFormDto.customer_code});
    const measure = await this.measuresRepository.findOneBy({user});
    
  }
}
