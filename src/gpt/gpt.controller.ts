import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { AudioToTextDto, ImageGenerationDto, ImageVariationDto, OrthographyDto, ProsConsDicusserDto,TextToAudioDto,TranslateDto } from './dtos';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {diskStorage} from 'multer'

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto:OrthographyDto
  ){
    return this.gptService.orthographyCheck(orthographyDto)
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(
    @Body() prosConsDicusserDto: ProsConsDicusserDto
  ){
    return this.gptService.prosConsDicusser(prosConsDicusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDicusserDto: ProsConsDicusserDto,
    @Res() res: Response
  ){
    const stream = await this.gptService.prosConsDicusserStream(prosConsDicusserDto);

    res.setHeader('Content-Type','application/json');
    res.status(HttpStatus.OK);

    //chunk pedazo de respuesta del stream
    for await(const chunk of stream){
      const piece = chunk.choices[0].delta.content || '';
      //console.log(piece);
      res.write(piece)
    }

    res.end();
  }

  
  @Post('translate')
  translate(
    @Body() translateDto: TranslateDto
  ){
    return this.gptService.translate(translateDto);
  }

  @Post('translate-stream')
  async translateStream(
    @Body() translateDto: TranslateDto,
    @Res() res: Response
  ){
    const stream = await this.gptService.translateStream(translateDto)
    res.setHeader('Content-Type','application/json');
    res.status(HttpStatus.OK);

    //chunk pedazo de respuesta del stream
    for await(const chunk of stream){
      const piece = chunk.choices[0].delta.content || '';
      //console.log(piece);
      res.write(piece)
    }

    res.end();
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response
  ){
    const filePath = await this.gptService.textToAudio(textToAudioDto);

    res.setHeader('Content-Type','audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }


  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string
  ){
    const filePath = await this.gptService.textToAudioGetter(fileId);

    res.setHeader('Content-Type','audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);

  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file',{
      storage: diskStorage({
        destination:'./generated/uploads',
        filename:(req,file,callback) =>{
          const fileExtension = file.originalname.split('.').pop();

          const fileName = `${new Date().getTime()}.${fileExtension}`;

          return callback(null,fileName);

        }
      })
    })
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators:[
          new MaxFileSizeValidator({maxSize: 1000 * 1024 * 5, message:'File is bigger than 5 mb'}),
          new FileTypeValidator({fileType:'audio/*'})
        ]
      })
    ) file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto
  ){

    return this.gptService.audioToText(file,audioToTextDto);
  }


  @Post('image-generation')
  async imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto
  ){

    return await this.gptService.imageGeneration(imageGenerationDto)
  }

  @Get('image-generation/:filename')
  async getGeneratedImage(
    @Res() res: Response,
    @Param('filename') filename: string
  ){

    const filePath =  this.gptService.getGeneratedImage(filename)

    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('image-variation')
  async imageVariation(
    @Body() imageVariationDto: ImageVariationDto
  ){

    return await this.gptService.generatedImageVariation(imageVariationDto)
  }
}
