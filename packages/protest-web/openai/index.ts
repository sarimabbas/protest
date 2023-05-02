import { Configuration, OpenAIApi } from "openai";

const openAIConfig = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

export const openAI = new OpenAIApi(openAIConfig);
