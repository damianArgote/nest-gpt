import * as path from 'path';
import * as fs from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { audioToTextUseCase, generateImageVariationUseCase, imageGenerationUseCase, orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase, textToAudioUseCase, translateStreamUseCase, translateUsecase } from './uses-cases';
import { AudioToTextDto, ImageGenerationDto, ImageVariationDto, OrthographyDto, ProsConsDicusserDto, TextToAudioDto, TranslateDto } from './dtos';
import OpenAI from 'openai';

@Injectable()
export class GptService {

private openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY
})

//Solo llama casos de usos

   async orthographyCheck(orthographyDto:OrthographyDto){
        return await orthographyCheckUseCase(this.openai,{
            prompt: orthographyDto.prompt
        }); 
    }

    async prosConsDicusser({ prompt }: ProsConsDicusserDto) {
        return await prosConsDicusserUseCase(this.openai, { prompt });
      }

      async prosConsDicusserStream({ prompt }: ProsConsDicusserDto) {
        return await prosConsDicusserStreamUseCase(this.openai, { prompt });
      }

      async translate({ prompt,lang }: TranslateDto) {
        return await translateUsecase(this.openai, { prompt,lang });
      }

      async translateStream({ prompt,lang }: TranslateDto) {
        return await translateStreamUseCase(this.openai, { prompt,lang });
      }

      async textToAudio({ prompt,voice }: TextToAudioDto) {
        return await textToAudioUseCase(this.openai, { prompt,voice });
      }

      async textToAudioGetter(fileId: string){
        const filePath = path.resolve(__dirname,'../../generated/audios/',`${fileId}.mp3`);
        const wasFound = fs.existsSync(filePath)

        if(!wasFound) throw new NotFoundException(`File ${fileId} not found`);

        return filePath;
        
      }


      async audioToText(audioFile:Express.Multer.File, audioToTextDto?: AudioToTextDto){
        const {prompt} = audioToTextDto
        return await audioToTextUseCase(this.openai,{audioFile,prompt});
      }

      async imageGeneration(imageGeneration: ImageGenerationDto){

        return await imageGenerationUseCase(this.openai,imageGeneration);
      }

       getGeneratedImage(filename: string){
        const filePath = path.resolve('./','./generated/images/',filename);
        const wasFound = fs.existsSync(filePath)

        if(!wasFound) throw new NotFoundException(`File ${filename} not found`);
        return filePath;
      }

      async generatedImageVariation({baseImage}: ImageVariationDto){

        return generateImageVariationUseCase(this.openai,{baseImage});

      }
}
