import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

// Given the following conversation and a follow-up question, rephrase the follow-up question to be a standalone question that could be used for a personality disorder assessment.
// Given this conversation, can you identify any potential personality traits or disorders? Please provide a specific example from the chat history to support your answer.
const CONDENSE_PROMPT = `Given the following conversation and a follow-up question, rephrase the follow-up question to be a standalone question that could be used for a personality disorder assessment.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT = `You are a helpful AI assistant trained to assist with personality disorder assessments. Use the following pieces of context to provide a response that could help identify a potential personality disorder. If you don't know the answer, please state so clearly. Do not attempt to provide a diagnosis or offer unqualified medical advice. If the question is not related to personality disorders, politely respond that you are programmed to focus on providing information related to personality disorders.

{context}

Question: {question}
Helpful answer in markdown:(optional)`;

export const makeChain = (vectorstore: PineconeStore) => {
  const model = new OpenAI({
    temperature: 0, // increase temepreature to get more creative answers
    modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: true, //The number of source documents returned is 4 by default
    },
  );
  return chain;
};
