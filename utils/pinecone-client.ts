// import { PineconeClient } from '@pinecone-database/pinecone';

// if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
//   throw new Error('Pinecone environment or api key vars missing');
// }

// async function initPinecone() {
//   try {
//     const pinecone = new PineconeClient();

//     await pinecone.init({
//       environment: process.env.PINECONE_ENVIRONMENT ?? 'gcp-starter', //this is in the dashboard
//       apiKey: process.env.PINECONE_API_KEY ?? '9b726043-a879-4d8b-9f3b-1fe9f3261711',
//     });

//     return pinecone;
//   } catch (error) {
//     console.log('error', error);
//     throw new Error('Failed to initialize Pinecone Client');
//   }
// }

// export const pinecone = await initPinecone();


 