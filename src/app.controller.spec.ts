import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadResponseDTO } from './dtos/uploadResponse.dto';
import { MeasureType, UploadFormRequestDTO } from './dtos/uploadForm.dto';
import { randomUUID } from 'crypto';
import { ConfirmBodyDTO } from './dtos/confirmBody.dto';
import { CustomerMeasuresResponse } from './dtos/customerMeasuresResponse.dto';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const appServiceMock = {
      uploadImageTest: jest.fn(),
      confirmMeasure: jest.fn(),
      retrieveCustomerMeasures: jest.fn()
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{
        provide: AppService,
        useValue:appServiceMock
      }],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('Upload Image to Google Gemini', () => {
    it('should return the result from appService.uploadImageTest',async () => {
      const requestDTO:UploadFormRequestDTO = {
        customer_code: randomUUID(),
        image: "data:image/gif;base64,R0lGODlhAQABAAAAACw=",
        measure_datetime: new Date(),
        measure_type: MeasureType.GAS
      }
      const response: UploadResponseDTO = {
        image_url: 'https://some-url.com',
        measure_uuid: "some-uuid",
        measure_value: 179
      }

      jest.spyOn(appService, "uploadImageTest").mockResolvedValue(response);

      const result = await appController.postUploadImage(requestDTO);
      expect(result).toBe(response);
      expect(appService.uploadImageTest).toHaveBeenCalledWith(requestDTO);
    });
  });

  describe("Confirm a Measure", () => {
    it("should return the result from app.Service.confirmMeasure", async ()=> {
      const requestDTO:ConfirmBodyDTO = {
        measure_uuid: "some-uuid",
        confirmed_value: 100
      }

      const response = {success:true};

      jest.spyOn(appService, "confirmMeasure").mockResolvedValue(response);

      const result = await appController.confirmMeasure(requestDTO);

      expect(result).toBe(response);
      expect(appService.confirmMeasure).toHaveBeenCalledWith(requestDTO);

    })
  });

  describe('get A Customer Measures', () => {
    it('should return the result from appService.retrieveCustomerMeasures', async () => {
      const customer_code = 'some-uuid';
      const measure_type = 'SOME_TYPE';
      const response: CustomerMeasuresResponse = {
        customer_code: 'some-uuid',
        measures: [],
      };

      jest.spyOn(appService, 'retrieveCustomerMeasures').mockResolvedValue(response);

      const result = await appController.getCustomerMeasures(customer_code, measure_type);
      expect(result).toBe(response);
      expect(appService.retrieveCustomerMeasures).toHaveBeenCalledWith(customer_code, measure_type);
    });
  });
});
