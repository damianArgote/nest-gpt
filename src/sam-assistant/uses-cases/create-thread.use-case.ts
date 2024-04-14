import OpenAI from "openai";


//https://platform.openai.com/docs/assistants/overview?context=with-streaming

export const createThreadUseCase = async (openai:OpenAI) =>{

    const {id} = await openai.beta.threads.create();

    return {id}

}