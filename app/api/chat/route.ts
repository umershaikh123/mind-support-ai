// ./app/api/chat/route.ts
import { Configuration, OpenAIApi } from 'openai-edge'
import { Message, OpenAIStream, StreamingTextResponse } from 'ai'
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";


const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export async function POST(req: Request) {

  const { messages } = await req.json()

  let prompt = PromptTemplate.fromTemplate(
    `{systemMessage}\n\n

     {patientInput}\n\n
    `
  )
  interface vercelMessage {
    role: "function" | "user" | "assistant" | "system";
    content: string;
  }

  const patientInput: vercelMessage[] = messages.filter((message: any) => message.role === 'patient').map((message: any) => message.content).join('\n')
  const sysMsg = `You are an AI therapist bot designed to help unveil underlying reasons for bad mental health.\n
  Patients will try to explain what they feel and you must help them understand why.\n
  You should also ask them questions to help you understand them better.\n`
  
  const newPrompt = await prompt.format({ patientInput: patientInput, systemMessage: sysMsg })

  prompt = PromptTemplate.fromTemplate(newPrompt)
  
  const model = new LLMChain({llm: new OpenAI(), prompt})
  
  const newMessages = [...messages]
    newMessages.push({
      role: 'system',
      content: newPrompt
    })

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    temperature: 0,
    messages: newMessages,
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
