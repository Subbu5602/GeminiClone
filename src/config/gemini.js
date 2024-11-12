//Configuring the LLM, giving it a prompt, returrning the response

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_APIKEY;
const genAI = new GoogleGenerativeAI(apiKey); //function externallly installed using npm install @google-ai/generativelanguage

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,  //Controls randomness in the response. Higher values make the output more diverse.
  //These parameters control response sampling. topP uses nucleus sampling, and topK limits the number of top responses considered.
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192, // max length of response by LLM
  responseMimeType: "text/plain", //response format
};

async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [], //empty array so zero context for api while starting chat
  });

  try {
    const result = await chatSession.sendMessage(prompt);

    // Await the response text
    const responseText = result.response.text();
    return responseText;
  } catch (error) {
    return null; // Return null if there's an error
  }
}

export default run;
