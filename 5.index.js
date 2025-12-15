import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";

const ai = new GoogleGenAI({
  apiKey: "GEMINI_API_KEY", // use your key
});

const History = [];

/* ------------------ TOOLS ------------------ */

function sum({ num1, num2 }) {
  return num1 + num2;
}

function prime({ num }) {
  if (num < 2) return false;

  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

async function getCryptoPrice({ coin }) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`
  );
  const data = await response.json();
  return data;
}

/* ------------------ TOOL DECLARATIONS ------------------ */

const sumDeclaration = {
  name: "sum",
  description: "Get the sum of two numbers",
  parameters: {
    type: "object",
    properties: {
      num1: { type: "number" },
      num2: { type: "number" },
    },
    required: ["num1", "num2"],
  },
};

const primeDeclaration = {
  name: "prime",
  description: "Check whether a number is prime or not",
  parameters: {
    type: "object",
    properties: {
      num: { type: "number" },
    },
    required: ["num"],
  },
};

const cryptoPriceDeclaration = {
  name: "getCryptoPrice",
  description: "Get crypto price like bitcoin",
  parameters: {
    type: "object",
    properties: {
      coin: { type: "string" },
    },
    required: ["coin"],
  },
};

const availableTools = {
  sum,
  prime,
  getCryptoPrice,
};

/* ------------------ AGENT ------------------ */

async function runAgent(userProblem) {
  History.push({
    role: "user",
    parts: [{ text: userProblem }],
  });

  while (true) {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: History,
      config: {
        tools: [
          {
            functionDeclarations: [
              sumDeclaration,
              primeDeclaration,
              cryptoPriceDeclaration,
            ],
          },
        ],
      },
    });

    // ---------- Tool calling ----------
    if (response.functionCalls && response.functionCalls.length > 0) {
      const { name, args } = response.functionCalls[0];
      const toolFn = availableTools[name];

      if (!toolFn) {
        console.log("Unknown tool:", name);
        break;
      }

      const result = await toolFn(args);

      // model function call
      History.push({
        role: "model",
        parts: [{ functionCall: response.functionCalls[0] }],
      });

      // function response
      History.push({
        role: "tool",
        parts: [
          {
            functionResponse: {
              name,
              response: { result },
            },
          },
        ],
      });
    } else {
      // normal text response
      const text = response.text || "No response";
      console.log(text);

      History.push({
        role: "model",
        parts: [{ text }],
      });
      break;
    }
  }
}

/* ------------------ MAIN LOOP ------------------ */

async function main() {
  while (true) {
    const userProblem = readlineSync.question("\nAsk me anything ---> ");
    await runAgent(userProblem);
  }
}

main();
