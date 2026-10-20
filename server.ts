import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize Gemini SDK with User-Agent header as required
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `You are an ultra-fast calculator intelligence engine on a Casio fx-991 display.

CRITICAL SPEED & CONCISENESS RULES:
1. Output ONLY the direct final answer, number, term, date, or formula.
2. ZERO conversational filler, zero polite phrases, zero markdown.
3. Maximum brevity: 1-2 short lines.`;

// Ultra-fast text endpoint
app.post('/api/gemini/calculate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt.trim(),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1,
        maxOutputTokens: 50,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const answer = response.text ? response.text.trim() : 'Error';

    return res.json({
      success: true,
      query: prompt.trim(),
      answer: answer,
    });
  } catch (error: any) {
    console.error('Error generating answer:', error);
    return res.status(500).json({
      error: error?.message || 'Calculation engine error',
    });
  }
});

// Ultra-fast direct audio endpoint
app.post('/api/gemini/audio-query', async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const cleanMimeType = (mimeType || 'audio/webm').split(';')[0].trim();
    const audioPart = {
      inlineData: {
        mimeType: cleanMimeType,
        data: audioBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        audioPart,
        {
          text: 'Listen to the audio. Return exactly two lines:\nLine 1: The question heard\nLine 2: The direct answer only (no explanation, no filler)',
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1,
        maxOutputTokens: 60,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const text = response.text ? response.text.trim() : '';
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const query = lines.length > 1 ? lines[0] : '';
    const answer = lines.length > 1 ? lines.slice(1).join(' ') : (lines[0] || 'Error');

    return res.json({
      success: true,
      query: query,
      answer: answer,
    });
  } catch (error: any) {
    console.error('Error processing audio query:', error);
    return res.status(500).json({
      error: error?.message || 'Audio query failed',
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Casio fx-991 Server running on port ${PORT} (isProduction: ${isProduction})`);
  });
}

startServer();
