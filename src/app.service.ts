import { Injectable } from '@nestjs/common/decorators';
import { UploadFormRequestDTO } from './utils/uploadForm.dto';
import {isBase64} from "is-base64"
import { InvalidImageException } from './exceptions/invalidImage.exception';
import { uploadImage } from './gemini/gemini.file.manager';
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
    private usersRepository : Repository<User>
  ){}

  async uploadImageTest(uploadFormDto:UploadFormRequestDTO) {
    if(!isBase64(uploadFormDto.image, {allowMime:true})){
      throw new InvalidImageException();
    }

    try {
      const response = await uploadImage(uploadFormDto.image);
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    this.checkMeasure(uploadFormDto);

    console.log("Tudo certo até aqui, brow")
  }

  async checkMeasure(uploadFormDto: UploadFormRequestDTO) {
    const user = await this.usersRepository.findOneBy({id: uploadFormDto.customer_code});
    const measure = await this.measuresRepository.findOneBy({user});
    if (measure.has_confirmed) {
      throw new DoubleReportException();
    }
  }
}
