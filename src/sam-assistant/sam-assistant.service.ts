import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { checkCompleteStatusUseCase, createMessageUseCase, createRunUseCase, createThreadUseCase, getMessageListUseCase } from './uses-cases';
import { QuestionDto } from './dtos/question.dto';
import { threadId } from 'worker_threads';

@Injectable()
export class SamAssistantService {

    private openai = new OpenAI({
        apiKey:process.env.OPENAI_API_KEY
    })

    async createThread(){
        return await createThreadUseCase(this.openai);
    }

    async userQuestion(questionDto: QuestionDto){

        const{threadId,prompt} = questionDto
        const message = await createMessageUseCase(this.openai,{threadId,prompt});

        const run = await createRunUseCase(this.openai,{ threadId })
        
        await checkCompleteStatusUseCase(this.openai,{threadId, runId:run.id});

        const messages = getMessageListUseCase(this.openai,{threadId});

        return messages;
    }
}
