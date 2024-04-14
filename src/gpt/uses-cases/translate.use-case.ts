import OpenAI from 'openai';


interface Options{
    prompt:string;
    lang:string;
}

export const translateUsecase = async (openai:OpenAI, options: Options) =>{
    const {prompt,lang} = options

    const completion = await openai.chat.completions.create({
        messages: [
            
        { 
            role: "system", 
            content:`Traduce el siguiente texto al idioma ${lang}:${ prompt }`
        }
        ],
        model: "gpt-3.5-turbo"
      });
      
    
      return {message: completion.choices[0].message.content};

}