import OpenAI from "openai";

interface Options{
    threadId: string;
    prompt:string;
}

export const createMessageUseCase = async (openai:OpenAI,{threadId,prompt}:Options) =>{


    const message = await openai.beta.threads.messages.create(threadId,{
        role:'user',
        content:prompt
    });

    return message;

}