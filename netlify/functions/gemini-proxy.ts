import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import type { Handler } from "@netlify/functions";

interface RequestPayload {
  contents: any[];
  config?: any;
}

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const handler: Handler = async (event) => {
  // Headers CORS para permitir llamadas desde el frontend
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Manejar preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Usar GEMINI_API_KEY en lugar de API_KEY para consistencia
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { 
      statusCode: 500, 
      headers: corsHeaders,
      body: JSON.stringify({ error: 'La clave API de Gemini no está configurada en el servidor.' })
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const body: RequestPayload = JSON.parse(event.body || '{}');
    
    if (!body.contents) {
      return { 
        statusCode: 400, 
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Falta el contenido en la solicitud.' })
      };
    }

    // Obtener el modelo correcto
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      safetySettings 
    });

    const result = await model.generateContent(body.contents);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      body: JSON.stringify({ text }),
    };

  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: `Ocurrió un error al procesar la solicitud de IA: ${error.message}` 
      }),
    };
  }
};

export { handler };