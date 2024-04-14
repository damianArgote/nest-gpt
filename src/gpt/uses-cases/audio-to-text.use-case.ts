import * as fs from 'fs';
import OpenAI from "openai";


interface Options{
    prompt?: string;
    audioFile: Express.Multer.File;
}

//https://platform.openai.com/docs/guides/speech-to-text/supported-languages?lang=python
//https://platform.openai.com/docs/guides/speech-to-text/prompting
export const audioToTextUseCase = async (openai: OpenAI, {prompt,audioFile}: Options) =>{

const response = await openai.audio.transcriptions.create({
    model:'whisper-1',
    file: fs.createReadStream(audioFile.path),
    prompt:prompt, //mismo idioma del audio
    language:'es',
    response_format:'verbose_json' //vtt - srt
});

return response
}