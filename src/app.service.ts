import { Injectable } from '@nestjs/common/decorators';
import { UploadFormRequestDTO } from './dtos/uploadForm.dto';
import {isBase64} from "is-base64"
import { InvalidImageException } from './exceptions/invalidImage.exception';
import { GeminiService } from './gemini/gemini.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Measure } from './measures/measures.entity';
import { Repository } from 'typeorm';
import { User } from './users/user.entity';
import { UploadResponseDTO } from './dtos/uploadResponse.dto';
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

      const user = await this.usersRepository.findOneBy({id: uploadFormDto.customer_code});
      const validMeasure = await this.checkMeasure(uploadFormDto, user);
      if (!validMeasure) {
        throw new DoubleReportException();
      }

      let newMeasure = new Measure();
      newMeasure.image_url = uploadResponse.file.uri;
      newMeasure.has_confirmed = false;
      newMeasure.measure_datetime = uploadFormDto.measure_datetime;
      newMeasure.user = user;
      newMeasure.measure_type = uploadFormDto.measure_type;
      newMeasure.measure_value = parseInt(result);

      await this.measuresRepository.save(newMeasure);

      let response = new UploadResponseDTO();
      response.image_url = newMeasure.image_url;
      response.measure_uuid = newMeasure.id;
      response.measure_value = newMeasure.measure_value;

      return response;
  
    } catch (error) {
        console.error(error);
        throw error;
    }
  }

  async checkMeasure(uploadFormDto: UploadFormRequestDTO, user: User) {
    const measures = await this.measuresRepository.findBy({user});
    if (measures.length > 0) {
      for (let measure of measures) {
        if (measure.measure_datetime.getMonth() === new Date(uploadFormDto.measure_datetime).getMonth() &&
            measure.measure_type === uploadFormDto.measure_type) {
              return false;
            }
      }
      return true;
    }
  }
}
