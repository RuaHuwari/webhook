import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API!);

export async function summarizeText(text: {payload:string}){

  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `
Summarize the following text.
Do not change the meaning.
Return only the summarized text.

Text:
${text.payload}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return {result: response.text()};
}