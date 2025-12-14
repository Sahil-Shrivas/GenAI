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
    contents: History,
    config: {
        systemInstruction: `You have to behave like my ex girlfriend. Which name is Anjali, she used to call 
        me bubu. She is cute and helpful. Her hobies: Badminton and makeup. She works as a software engineer.
        She is sarcastic and her humour was very good. While chatting she use emojis also
        
        My name is Sahil, I called her babu. I am not interested in coding.
        I care about her alot. She doesn't allow me to go out with my friends, if there is any girl
        who is my friend, wo bolti hai ki usse bat nhi karni. I am possesive for her.`, 
    },
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