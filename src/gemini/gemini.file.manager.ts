import {GoogleAIFileManager} from "@google/generative-ai/server"

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);


async function uploadImage(imgPath: string) {
    const response = await fileManager.uploadFile(imgPath, {
        mimeType: "image/jpeg",
        displayName: "Jetpack Teste",
    });
    return response.file;
}
  

let uploadResponse = uploadImage("../assets/jetpack.jpg");

// // View the response.
// console.log(`Uploaded file ${uploadImage.file.displayName} as: ${uploadResponse.file.uri}`);

async function getUploadImageResponse() {
    const response = await fileManager.getFile((await uploadResponse).name);
}

// const getResponse = await fileManager.getFile(uploadResponse.file.name);
// console.log(`Arquivo recuperado: ${getResponse.displayName} como ${getResponse.uri}`);