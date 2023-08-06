import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { makeChain } from '@/utils/makechain';
// import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
// ./app/api/chat/route.ts
import { Configuration, OpenAIApi } from 'openai-edge'
import { Message, OpenAIStream, StreamingTextResponse } from 'ai'
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
 

import { NextResponse } from 'next/server';
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const { question, history } = req.body;

//   console.log('question', question);

//   //only accept post requests
//   if (req.method !== 'POST') {
//     res.status(405).json({ error: 'Method not allowed' });
//     return;
//   }

//   if (!question) {
//     return res.status(400).json({ message: 'No question in the request' });
//   }
//   // OpenAI recommends replacing newlines with spaces for best results
//   const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

//   try {
//     const index = pinecone.Index(PINECONE_INDEX_NAME);

//     /* create vectorstore*/
//     const vectorStore = await PineconeStore.fromExistingIndex(
//       new OpenAIEmbeddings({}),
//       {
//         pineconeIndex: index,
//         textKey: 'text',
//         namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
//       },
//     );

//     //create chain
//     const chain = makeChain(vectorStore);
//     //Ask a question using chat history
//     const response = await chain.call({
//       question: sanitizedQuestion,
//       chat_history: history || [],
//     });

//     console.log('response', response);
//     res.status(200).json(response);
//   } catch (error: any) {
//     console.log('error', error);
//     res.status(500).json({ error: error.message || 'Something went wrong' });
//   }
// }


import { PineconeClient } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
  throw new Error('Pinecone environment or api key vars missing');
}

async function initPinecone() {
  try {
    const pinecone = new PineconeClient();

    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? 'gcp-starter', //this is in the dashboard
      apiKey: process.env.PINECONE_API_KEY ?? '9b726043-a879-4d8b-9f3b-1fe9f3261711',
    });

    return pinecone;
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to initialize Pinecone Client');
  }
}



export async function POST(req: Request ) {

  const { question, history } = await req.json()

  console.log('Request body:', req.body);
  console.log('req ', req);
  console.log('req.json()', req.json());
  console.log('question', question);
  console.log('history', history);

 

  if (!question) {
    return NextResponse.json({ message: 'No questions' } , {status : 500});
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    const pineconeClient = await initPinecone();
    const index = pineconeClient.Index(PINECONE_INDEX_NAME);
    // const index =  pinecone.Index(PINECONE_INDEX_NAME);

    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
      },
    );

    //create chain
    const chain = makeChain(vectorStore);
    //Ask a question using chat history
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: history || [],
    });

    console.log('response', response);
    // res.status(200).json(response);
    NextResponse.json({ response: response } , {status : 200});
  } catch (error: any) {
    console.log('error', error);
    NextResponse.json({ error: error } , {status : 500});
  }
}
