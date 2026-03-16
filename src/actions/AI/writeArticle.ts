import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API!);

export async function writeArticle(text:{payload:string}){

  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `
Write an article on the following title,
make it short arround 150 words

Title:
${text.payload}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return {result:response.text()};
}