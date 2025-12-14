import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });   // use your key

const History =[]

async function Chatting(userProblem) {

    History.push({
        role:'user',
        parts:[{text:userProblem}]
    })

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: History    
  });


  History.push({
        role:'model',
        parts:[{text:userProblem}]
    })

    console.log("\n")
  console.log(response.text);
}


async function main(){

    const userProblem = readlineSync.question("Ask me anything ---> ");
    await Chatting(userProblem);
    main();
}


main();