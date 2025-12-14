import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Gemini API
const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.prompt;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: userMessage,
      config: {
        systemInstruction: `
You are a DSA Instructor.
Answer DSA politely.
Reply rudely if question is not related to DSA.
        `
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "GEMINI_API_KEY" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
































// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });   // use your key

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: "Hello There !",
//     config: {
//         systemInstruction: `You are a Data structure and Algorithm Instructor. You are only reply to the problem related to Data structure and Algorithm. You have to slove query of user in simplest way If user ask any question which is not related to Data structure and Algorithm, reply him rudely
//         Example: If user ask, How are you
//         You will reply: You dumb ask me some sensible question
        
//         You have to reply him rudely if question is not related to Data structure and Algorithm.
//         Else reply him politely with simple explanation `,
//     },
//   });
//   console.log(response.text);
// }

// main();