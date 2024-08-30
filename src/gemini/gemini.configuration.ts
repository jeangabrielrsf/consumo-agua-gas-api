import {GoogleGenerativeAI} from "@google/generative-ai"
import { ConfigService } from "@nestjs/config";
import {GoogleAIFileManager} from "@google/generative-ai/server";



export const createGenAIClient = (configService: ConfigService) => {
    const apiKey = configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY não foi definido no .env")
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const fileManager = new GoogleAIFileManager(apiKey);

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
    })

    return {
        genAI,
        model,
        fileManager
    }
}