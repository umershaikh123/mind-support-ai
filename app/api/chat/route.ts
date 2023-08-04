// ./app/api/chat/route.ts
import { Configuration, OpenAIApi } from "openai-edge";
import Replicate from "replicate";
import {
  type Message,
  ReplicateStream,
  StreamingTextResponse,
  OpenAIStream,
} from "ai";
import { PromptTemplate } from "langchain";
import * as langchain from "langchain";

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json();

  let response: any;
  let stream: ReadableStream;
  let openai: OpenAIApi;
  let replicate: Replicate;
  let template: PromptTemplate;

  template = new PromptTemplate({
    inputVariables: ["messages"],
    template: "You are a clinical therapist and you goal is to assess, identify and resolve root causes of poor mental health.\n Do not offer extensive help prior to finding out as much information as you can through focusing on triggers in {messages}. Use {messages} as context to build an emotional and mental wellness review.\n Keep messages short and simple until you have formulated a solid opinion based additional information you have extracted after the first few messages.\n"
  }); 


  if (process.env.PROVIDER === "replicate") {

    replicate = new Replicate({
      auth: process.env.REPLICATE_API_KEY ,
    });

    response = await replicate.predictions.create({
      // Llama-70b-chat
      version:
        "2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1",
      input: { prompt: messages.map((m: Message) => m.content).join("\n") },
      stream: true,
    });

    stream = await ReplicateStream(response);

  } else if(process.env.PROVIDER === "openai") {

    const config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY ,
    });
    openai = new OpenAIApi(config);

    response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: messages.map((message: any) => ({
        content: message.content,
        role: message.role,
      })),
    });

    stream = OpenAIStream(response);
    
  }

  return new StreamingTextResponse(stream);

}
