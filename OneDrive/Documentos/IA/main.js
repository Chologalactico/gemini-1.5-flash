//Importaciones
const express = require("express");  
const { GoogleGenerativeAI } = require("@google/generative-ai");  

const app = express(); //Instancia express
app.use(express.json());  // Middleware para parsear JSON en las solicitudes entrantes.
const port = process.env.PORT || 3000;  

const apiKey = process.env.API_KEY; //Llamado a la API_key 
// Verificacion de API_KEY.
if (!apiKey) {
  console.error(
    "API key not found. Please set the API_KEY environment variable."
  ); 
  process.exit(1); 
}

// Crea una instancia de GoogleGenerativeAI con la clave de API.
const genAI = new GoogleGenerativeAI(apiKey);
// Obtiene un modelo generativo específico ("gemini-1.5-flash").
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Endopoint Get 
//Generamos una pregunta desde el backend  
app.get("/generate", async (req, res) => {
  try {
    const prompt = req.query.prompt || "Write a story about the funcion";  //Generacion de pregunta
    
    const result = await model.generateContent(prompt);  // Genera contenido utilizando el modelo.
    const response = await result.response;  // Obtiene la respuesta del modelo.
    const text = await response.text();  // Extrae el texto de la respuesta.

    res.json({ text });  // Envía el texto generado como respuesta en formato JSON.
  } catch (error) {
    console.error("Error generating content:", error);  
    res.status(500).json({ error: "Error generating content" });  
  }
});

// Define una ruta GET para verificar la salud del servidor.
app.get("/health", (req, res) => {
  res.json({ status: "OK" }); 
});

// Define una ruta POST para generar contenido.
app.post("/generate", async (req, res) => {
  try {
    console.log(req.body);  // Imprime el cuerpo de la solicitud en la consola.
    const prompt = req.body.prompt || "Write a story about the funcion";  // Obtiene el prompt del cuerpo de la solicitud o usa un valor por defecto.

    const result = await model.generateContent(prompt);  // Genera contenido utilizando el modelo.
    const response = await result.response;  // Obtiene la respuesta del modelo.
    const text = await response.text();  // Extrae el texto de la respuesta.

    res.json({ text });  // Envía el texto generado como respuesta en formato JSON.
  } catch (error) {
    console.error("Error generating content:", error);  // Muestra un error si ocurre algún problema.
    res.status(500).json({ error: "Error generating content" });  // Envía un mensaje de error en formato JSON.
  }
});

// Inicia el servidor y lo pone a escuchar en el puerto especificado.
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

//test
