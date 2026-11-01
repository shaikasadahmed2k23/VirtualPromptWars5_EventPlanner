import { GoogleGenAI, type ThinkingConfig, ThinkingLevel } from '@google/genai';

/** One structured-output request to a language model. */
export interface ModelRequest {
  systemInstruction: string;
  prompt: string;
  /** JSON Schema the model's output must follow. */
  responseSchema: object;
  signal: AbortSignal;
}

/** Abstraction over the model provider; the server depends only on this. */
export interface ModelClient {
  /** Returns the model's raw text output (expected to be JSON). */
  generateJson: (request: ModelRequest) => Promise<string>;
}

const TEMPERATURE = 0.8;

/**
 * Keeps "thinking" light: a structured plan needs breadth rather than deep
 * reasoning, and default thinking pushed full plans past the 20s deadline in
 * testing (no budget ≈ 15s, valid output). Gemini 2.5 Flash models take a
 * token budget; the Gemini 3 family takes a thinking level instead.
 */
export function thinkingConfigFor(model: string): ThinkingConfig | undefined {
  if (model.startsWith('gemini-2.5-flash')) return { thinkingBudget: 0 };
  if (model.startsWith('gemini-3')) return { thinkingLevel: ThinkingLevel.LOW };
  return undefined;
}

/**
 * Gemini client using the official `@google/genai` SDK with structured output
 * (`responseMimeType: application/json` + `responseJsonSchema`).
 * The API key stays on the server; it is never logged or returned.
 */
export function createGeminiClient(apiKey: string, model: string): ModelClient {
  const ai = new GoogleGenAI({ apiKey });
  const thinkingConfig = thinkingConfigFor(model);
  return {
    async generateJson({ systemInstruction, prompt, responseSchema, signal }) {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseJsonSchema: responseSchema,
          temperature: TEMPERATURE,
          abortSignal: signal,
          ...(thinkingConfig ? { thinkingConfig } : {}),
        },
      });
      return response.text ?? '';
    },
  };
}
