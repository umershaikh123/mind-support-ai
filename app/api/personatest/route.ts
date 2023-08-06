import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { makeChain } from "@/utils/makechain";
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from "@/config/pinecone";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";
import { Configuration, OpenAIApi } from "openai-edge";
import { PromptTemplate } from "langchain";

// if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
//   throw new Error('Pinecone environment or api key vars missing');
// }

async function initPinecone() {
  try {
    const pinecone = new PineconeClient();

    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? "gcp-starter", //this is in the dashboard
      apiKey:
        process.env.PINECONE_API_KEY ?? "9b726043-a879-4d8b-9f3b-1fe9f3261711",
    });

    return pinecone;
  } catch (error) {
    console.log("error", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

let session: { lastQuestionIndex: number, secondIndex: number } = { lastQuestionIndex: -1, secondIndex: -1 };

export async function POST(req: Request) {
  /**
   * Chat interface will ask the user questions asynchronously
   * the chat interface will return their answer and it should be
   * stored in the chat history.
   * We do not use openai for this part. This is just a simple
   * question and answer exchange between frontend and this api.
   */

  // Define the personality trait questions
  const personalityTraitQuestions: string[] = [
    "Sometimes rude to others.",
    "Has a forgiving nature.",
    "Considerate and kind to almost everyone.",
    "Does a thorough job.",
    "Tends to be lazy.",
    "Does things efficiently.",
    "Talkative.",
    "Outgoing and sociable.",
    "Reserved.",
    "Worries a lot.",
    "Gets nervously easily.",
    "Relaxed and handles stress well.",
    "Worries a lot.",
    "Gets nervously easily.",
    "Relaxed and handles stress well.",
    "Original and comes up with new ideas.",
    "Values artistic and aesthetic experiences.",
    "Has an active imagination.",
  ];

  // Define the mental health dimension questions
  const mentalHealthDimensionQuestions: string[] = [
    "Able to concentrate on whatever you're doing.",
    "Lost much sleep over worry.",
    "Felt that you were playing a useful part in things.",
    "Felt capable of making decisions about things.",
    "Felt constantly under strain.",
    "Felt you couldn't overcome your difficulties.",
    "Able to enjoy your normal day-to-day activities.",
    "Able to face up to problems.",
    "Feeling unhappy or depressed.",
    "Losing confidence in yourself.",
    "Thinking of yourself as a worthless person.",
    "Feeling reasonably happy, all things considered.",
  ];

  interface vercelMessage {
    role: "function" | "user" | "assistant" | "system";
    content: string;
  }

  interface Question {
    type: "personality" | "mentalHealth";
    question: string;
  }

  const stringToBytes = (str: string) => {
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      bytes[i] = str.charCodeAt(i);
    }
    return bytes;
  };

  function getNextQuestion(lastIndex: number): Question | null {
    const totalQuestions =
      personalityTraitQuestions.length + mentalHealthDimensionQuestions.length;
    
      const currentType =
      lastIndex < personalityTraitQuestions.length
        ? "personality"
        : "mentalHealth";
    const currentQuestions =
      currentType === "personality"
        ? personalityTraitQuestions
        : mentalHealthDimensionQuestions;
    const nextIndex = lastIndex + 1;

    if (nextIndex >= totalQuestions*2) {
      return null; // No more questions
    }

    return {
      type: currentType,
      question: currentQuestions[nextIndex],
    };
  }
  const { messages } = await req.json();
  console.log("messages", messages);

  // Filter out patient messages and collect their inputs
  const patientInputs: string[] = messages
    .filter((message: any) => message.role === "patient")
    .map((message: any) => message.content);

  // Process the patient's inputs and store them based on the question type
  const personalityTraits: { [trait: string]: number } = {};
  const mentalHealthDimensions: { [dimension: string]: number } = {};

  // Process each patient input and store the answers based on the question type
  let lastQuestionIndex = session.lastQuestionIndex;
  let secondIndex = session.secondIndex;
  for (let i = 0; i < patientInputs.length; i++) {
    const input = patientInputs[i];
    if (lastQuestionIndex >= 0) {
      const currentType =
        lastQuestionIndex < personalityTraitQuestions.length
          ? "personality"
          : "mentalHealth";

      const qSet = currentType === "personality" ? personalityTraitQuestions : mentalHealthDimensionQuestions;
      const currentAnswers =
        currentType === "personality"
          ? personalityTraits
          : mentalHealthDimensions;
      currentAnswers[qSet[lastQuestionIndex >= personalityTraitQuestions.length ? secondIndex: lastQuestionIndex]] =
        Number(input);
    }
    if(lastQuestionIndex >= personalityTraitQuestions.length) {
      session.secondIndex++;
    }
    lastQuestionIndex++;
  }

  // Get the next question to ask
  const nextQuestion = getNextQuestion(session.lastQuestionIndex);



  if (nextQuestion) {
    console.log("nextQuestion", nextQuestion);
    const readableStreamQuestion: ReadableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(stringToBytes(nextQuestion.question));
        controller.close();
      },
    });

    if(nextQuestion.type === "personality") {
      const prompt = `Personality trait: ${nextQuestion.question}\n\n1. Strongly disagree\n2. Disagree\n3. Neutral\n4. Agree\n5. Strongly agree\n\n`;
      personalityTraits[nextQuestion.question] = Number(patientInputs[patientInputs.length - 1]);
      console.log("personalityTraits", personalityTraits);
    } else {
      const prompt = `Mental health dimension: ${nextQuestion.question}\n\n1. Strongly disagree\n2. Disagree\n3. Neutral\n4. Agree\n5. Strongly agree\n\n`;
      mentalHealthDimensions[nextQuestion.question] = Number(patientInputs[patientInputs.length - 1]);
      console.log("mentalHealthDimensions", mentalHealthDimensions);
    }


    // Store the last question index in the session
    session.lastQuestionIndex++;

    return new StreamingTextResponse(readableStreamQuestion);
  } else {
    // All questions answered, send completion message
    let resultsStreamResponse: ReadableStream = new ReadableStream({
      start(controller) {
        controller.enqueue({
          role: "system",
          content:
            "Thank you for completing the assessment. We will now process your results.",
        });
        controller.close();
      },
    });

    // You can now access the user's answers from localStorage and process them as needed
    console.log("Personality answers:", personalityTraits);
    console.log("Mental health answers:", mentalHealthDimensions);

    return new StreamingTextResponse(resultsStreamResponse);
  }
}

// patientsInputs = patientInput;

// let prompt = PromptTemplate.fromTemplate(
//   `{systemMessage}\n\n

//    {patientInput}\n\n
//   `
// );

// const sysMsg = `You are an AI personality disorder diagnostic assistant. You will be provided with a series of questions a patient has answered.\n
// You will assess the patient based on the numerical rating they have provided for each question.\n
// The assessment should follow the guidelines of the DSM-5.\n`;

// const newPrompt = await prompt.format({
//   patientInput: patientInput,
//   systemMessage: sysMsg,
// });

// prompt = PromptTemplate.fromTemplate(newPrompt);

// const { question, history } = await req.json()

// console.log('Request body:', req.body);
// console.log('req ', req);
// console.log('req.json()', req.json());
// console.log('question', question);
// console.log('history', history);

// // OpenAI recommends replacing newlines with spaces for best results
// const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

// // try {
//   const pineconeClient = await initPinecone();
//   const index = pineconeClient.Index(PINECONE_INDEX_NAME);
//   // const index =  pinecone.Index(PINECONE_INDEX_NAME);
//   console.log("STEP!")
//   /* create vectorstore*/
//   const vectorStore = await PineconeStore.fromExistingIndex(
//     new OpenAIEmbeddings({}),
//     {
//       pineconeIndex: index,
//       textKey: 'text',
//       namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
//     },
//   );
//   console.log("STEP!!")

//   //create chain
//   const chain = makeChain(vectorStore);
//   //Ask a question using chat history
//   const response = await chain.stream({
//     question: sanitizedQuestion,
//     chat_history: history || [],
//   });
//   console.log("STEP!!!")

//   console.log('response', response);

//   const responseStream = OpenAIStream(response)

// // Convert the response into a friendly text-stream
// const stream = OpenAIStream(response)
// // Respond with the stream
// return new StreamingTextResponse(stream)

// } catch (error: any) {
//   console.log('error', error);
//   NextResponse.json({ error: error } , {status : 500});
// }
