const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());  //middleware
const port = process.env.PORT || 3000;

// Generate API key
const apiKey = process.env.API_KEY;
// Si la API KEY no funciona bien
if (!apiKey) {
  console.error(
    "API key not found. Please set the API_KEY environment variable."
  );
  process.exit(1);
}

// Generate IA
const genAI = new GoogleGenerativeAI(apiKey);
// Generate Model:
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get("/generate", async (req, res) => {
  try {
    const prompt = req.query.prompt || "Write a story about the funcion";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    res.json({ text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Error generating content" });
  }
});

// main.js (39-48)
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// main.js (49-63)
app.post("/generate", async (req, res) => {
  try {
    console.log(req.body);
    const prompt = req.body.prompt || "Write a story about the funcion";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    res.json({ text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Error generating content" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


//test