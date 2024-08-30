import { Inject, Injectable } from "@nestjs/common";
import { UploadFormRequestDTO } from "src/dtos/uploadForm.dto";
import { createGenAIClient } from "./gemini.configuration";
import { UploadFileResponse } from "@google/generative-ai/dist/server/server";
import { readFileSync, writeFile } from "fs";


@Injectable()
export class GeminiService {
    constructor(
        @Inject('GENAI_CLIENT')
        private readonly genAIClient: ReturnType<typeof createGenAIClient>,
    ){}

    private imagePath:string;

    async uploadImage(uploadFormDto: UploadFormRequestDTO) {
        let imageStr = stripBase64(uploadFormDto.image);
        this.imagePath= `assets/${uploadFormDto.measure_type}_${uploadFormDto.customer_code}.jpeg`;
        writeFile(this.imagePath, 
            imageStr,
            {encoding: 'base64'},
            function(err){
                console.log("arquivo de imagem criado!");
            }
        )
        const uploadResponse = await this.genAIClient.fileManager.uploadFile(this.imagePath, {
            mimeType: "image/jpeg",
            displayName: "Medidor"
        });
        console.log(`Upado arquivo ${uploadResponse.file.displayName} como ${uploadResponse.file.uri}`);

        return uploadResponse;
    }

    async checkUploadedImage(uploadResponse: UploadFileResponse) {
        const response = await this.genAIClient.fileManager.getFile(uploadResponse.file.name);
        return response;
    }

    async getImageValue(uploadFormDto: UploadFormRequestDTO) {

        const filePart = this.fileToGenerativePart(this.imagePath, "image/jpeg")
        const prompt = `Quanto está medindo o medidor da imagem?`;
        const result = await this.genAIClient.model.generateContent([
            prompt,
            filePart
        ])
        return result.response.text();
    }

    fileToGenerativePart(path, mimeType) {
        return {
            inlineData: {
                data: Buffer.from(readFileSync(path)).toString("base64"),
                mimeType
            },
        };
    }


}

function stripBase64(imageStr: string) {
    let base64Image = imageStr;
    if (base64Image.includes("data:image")) {
        base64Image = base64Image.split(";base64,").pop();
    }
    return base64Image;
}
  