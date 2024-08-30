import { Injectable } from '@nestjs/common/decorators';
import { UploadFormRequestDTO, MeasureType } from './dtos/uploadForm.dto';
import {isBase64} from "is-base64"
import { InvalidImageException } from './exceptions/invalidImage.exception';
import { GeminiService } from './gemini/gemini.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Measure } from './measures/measures.entity';
import { Repository } from 'typeorm';
import { User } from './users/user.entity';
import { UploadResponseDTO } from './dtos/uploadResponse.dto';
import { DoubleReportException } from './exceptions/doubleReport.exception';
import { ConfirmBodyDTO } from './dtos/confirmBody.dto';
import { MeasureNotFoundException } from './exceptions/measureNotFound.exception';
import { ConfirmationDuplicateException } from './exceptions/confirmationDuplicate.exception';
import { UserMeasuresNotFoundException } from './exceptions/userMeasuresNotFound.exception';
import { InvalidMeasureTypeException } from './exceptions/invalidMeasureType.exception';
import { CustomerMeasuresResponse } from './dtos/customerMeasuresResponse.dto';
import { InvalidDataException } from './exceptions/invalidData.exception';


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

    if (!Object.values(MeasureType).includes(uploadFormDto.measure_type as MeasureType)) {
      throw new InvalidDataException();
    }

    try {
      const uploadResponse = await this.geminiService.uploadImage(uploadFormDto);
      const result = await this.geminiService.getImageValue(uploadFormDto);

      const user = await this.usersRepository.findOneBy({id: uploadFormDto.customer_code});
      const validMeasure = await this.checkMeasureIsNotDouble(uploadFormDto, user);
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



  async confirmMeasure(confirmBody : ConfirmBodyDTO) {
    const measure = await this.measuresRepository.findOneBy({id: confirmBody.measure_uuid});
    if (!measure) {
      throw new MeasureNotFoundException();
    }

    if (measure.has_confirmed) {
      throw new ConfirmationDuplicateException();
    }

    measure.has_confirmed = true;
    measure.measure_value = confirmBody.confirmed_value;
    
    try {
      await this.measuresRepository.save(measure);
    } catch (error) {
      console.error("Erro ao confirmar a medição.");
    }

    return {
      "success": true
    };
  }

  async retrieveCustomerMeasures(customer_code: string, measure_type: string | undefined) {
    const user = await this.usersRepository.findOneBy({id: customer_code});
    let measures;
    if (measure_type){
      if (!Object.values(MeasureType).includes(measure_type as MeasureType))
      throw new InvalidMeasureTypeException();

      measures = await this.measuresRepository.find({where: {
        user: user,
        measure_type: measure_type
      }});
    } else {
      measures = await this.measuresRepository.findBy({user});
    }
    
    if (measures.length === 0) {
      throw new UserMeasuresNotFoundException();
    }

    const transformMeasures = measures.map(measure => ({
      measure_uuid: measure.id,
      measure_type: measure.measure_type,
      measure_datetime: measure.measure_datetime,
      has_confirmed: measure.has_confirmed,
      image_url: measure.image_url,
    }))

    const response = new CustomerMeasuresResponse();
    response.customer_code = user.id;
    response.measures = transformMeasures;

    return response;
  }


  async checkMeasureIsNotDouble(uploadFormDto: UploadFormRequestDTO, user: User) {
    const measures = await this.measuresRepository.findBy({user});
    if (measures.length > 0) {
      for (let measure of measures) {
        if (measure.measure_datetime.getMonth() === new Date(uploadFormDto.measure_datetime).getMonth() &&
            measure.measure_type === uploadFormDto.measure_type) {
              return false;
            }
      }
    }
    return true;
  }
}
