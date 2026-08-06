import { GoogleGenAI } from '@google/genai';
import { DiagnosticResult, Vehicle, Modification } from '../types';

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key is missing. Add VITE_GEMINI_API_KEY to your .env file.');
  return new GoogleGenAI({ apiKey });
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isRateLimit = (err: any): boolean => {
  const msg = String(err?.message || err || '');
  return msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota');
};

// Auto-retry once after a delay on rate-limit errors
const withRetry = async <T>(fn: () => Promise<T>, retries = 2, delayMs = 6000): Promise<T> => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (isRateLimit(err) && attempt < retries) {
        await sleep(delayMs * (attempt + 1));
        continue;
      }
      throw err;
    }
  }
  throw new Error('Unreachable');
};

const wrapGeminiError = (err: any): never => {
  const msg: string = String(err?.message || err || '');
  if (isRateLimit(err)) {
    throw new Error('rate_limit');
  }
  if (msg.includes('403') || msg.includes('API_KEY_INVALID') || msg.includes('invalid')) {
    throw new Error('Invalid Gemini API key. Check your .env file.');
  }
  throw err;
};

// ─── OBD-II Diagnostic Analysis ─────────────────────────────────────────────
export const analyzeDiagnosticCode = async (
  vehicle: Vehicle,
  code: string
): Promise<DiagnosticResult> => {
  const ai = getClient();
  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-lite',
        contents: `You are an expert automotive mechanic. Analyze OBD-II code "${code}" for a ${vehicle.year} ${vehicle.make} ${vehicle.model} with ${vehicle.mileage} miles.

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "code": "${code}",
  "title": "short name of the fault",
  "description": "plain English explanation",
  "severity": "low" or "medium" or "high" or "critical",
  "likelyCauses": ["cause 1", "cause 2", "cause 3"],
  "estimatedRepairCost": "$X - $Y",
  "partsNeeded": ["part 1", "part 2"],
  "canDrive": true or false,
  "diyInstructions": {
    "feasibility": "Easy/Moderate/Advanced DIY",
    "tools": ["tool 1", "tool 2"],
    "steps": ["step 1", "step 2", "step 3"],
    "savings": "$X - $Y"
  }
}`,
      });
      const text = (response.text || '').trim();
      const clean = text.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
      try {
        return JSON.parse(clean) as DiagnosticResult;
      } catch {
        throw new Error('AI returned an unexpected response format. Please try again.');
      }
    });
  } catch (err) {
    return wrapGeminiError(err);
  }
};

// ─── Modification Suggestions ────────────────────────────────────────────────
export const getModifications = async (vehicle: Vehicle): Promise<Modification[]> => {
  const ai = getClient();
  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-lite',
        contents: `You are a performance tuning expert. Suggest 5 modifications for a ${vehicle.year} ${vehicle.make} ${vehicle.model}.

Return ONLY a valid JSON array (no markdown, no code blocks):
[
  {
    "id": "1",
    "name": "mod name",
    "category": "Performance/Suspension/Exhaust/Air Intake/Brakes",
    "description": "what it does",
    "costEstimate": "$X - $Y",
    "difficulty": "easy" or "moderate" or "advanced",
    "performanceImpact": [
      { "label": "Horsepower", "stock": 180, "modded": 210, "unit": "hp" }
    ],
    "installationSteps": ["step 1", "step 2"],
    "requiredTools": ["tool 1", "tool 2"]
  }
]`,
      });
      const text = (response.text || '').trim();
      const clean = text.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
      return JSON.parse(clean) as Modification[];
    });
  } catch (err) {
    return wrapGeminiError(err);
  }
};

// ─── AI Chat ─────────────────────────────────────────────────────────────────
export const sendChatMessage = async (
  vehicle: Vehicle,
  message: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  const ai = getClient();
  try {
    return await withRetry(async () => {
      const chat = ai.chats.create({
        model: 'gemini-2.0-flash-lite',
        config: {
          systemInstruction: `You are BuildScript AI, a friendly automotive mentor for a ${vehicle.year} ${vehicle.make} ${vehicle.model} with ${vehicle.mileage} miles.
Make car maintenance easy for people with zero car experience.
- Use simple language and analogies.
- Prioritize safety. If dangerous, say "⚠️ SAFETY FIRST".
- Use numbered lists for steps.
- Be encouraging and empathetic.
- Keep answers concise but helpful.`,
        },
        history,
      });
      const response = await chat.sendMessage({ message });
      return response.text || 'Sorry, I could not generate a response. Please try again.';
    });
  } catch (err) {
    return wrapGeminiError(err);
  }
};

// ─── Image Analysis ───────────────────────────────────────────────────────────
export const analyzeVehicleImage = async (
  vehicle: Vehicle,
  base64Image: string,
  prompt = 'Identify any warning lights, visible damage, or issues in this image.',
  mimeType: string = 'image/jpeg'
): Promise<string> => {
  const ai = getClient();
  try {
    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-lite',
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: mimeType } },
            { text: `Vehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model}. ${prompt}` },
          ],
        } as any,
      });
      return response.text || "I couldn't analyze the image. Please try a clearer photo.";
    });
  } catch (err) {
    return wrapGeminiError(err);
  }
};
