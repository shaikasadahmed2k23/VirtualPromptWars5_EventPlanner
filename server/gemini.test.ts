// @vitest-environment node
import type * as GenAI from '@google/genai';
import { ThinkingLevel } from '@google/genai';
import { aiPlanSchema } from '../shared/ai.js';
import { createGeminiClient, thinkingConfigFor } from './services/gemini.js';
import { PLAN_MODEL_SCHEMA } from './services/modelSchemas.js';
import { delimit, neutralise } from './services/prompts.js';

const generateContent = vi.fn();

vi.mock('@google/genai', async (importOriginal) => {
  const actual = await importOriginal<typeof GenAI>();
  return {
    ...actual,
    GoogleGenAI: vi.fn(() => ({ models: { generateContent } })),
  };
});

describe('createGeminiClient', () => {
  it('requests JSON structured output with the derived schema, low thinking and the abort signal', async () => {
    generateContent.mockResolvedValue({ text: '{"ok":true}' });
    const signal = new AbortController().signal;
    const client = createGeminiClient('test-key', 'gemini-2.5-flash');

    const text = await client.generateJson({
      systemInstruction: 'rules',
      prompt: 'plan',
      responseSchema: { type: 'object' },
      signal,
    });

    expect(text).toBe('{"ok":true}');
    expect(generateContent).toHaveBeenCalledWith({
      model: 'gemini-2.5-flash',
      contents: 'plan',
      config: expect.objectContaining({
        systemInstruction: 'rules',
        responseMimeType: 'application/json',
        responseJsonSchema: { type: 'object' },
        abortSignal: signal,
        thinkingConfig: { thinkingBudget: 0 },
      }) as unknown,
    });
  });
});

describe('thinkingConfigFor', () => {
  it('chooses the right control for each model family', () => {
    expect(thinkingConfigFor('gemini-2.5-flash')).toEqual({ thinkingBudget: 0 });
    expect(thinkingConfigFor('gemini-3.8-flash')).toEqual({ thinkingLevel: ThinkingLevel.LOW });
    expect(thinkingConfigFor('some-other-model')).toBeUndefined();
  });
});

describe('model schema', () => {
  it('keeps only the structural keywords Gemini can serve', () => {
    const serialised = JSON.stringify(PLAN_MODEL_SCHEMA);
    for (const keyword of ['minItems', 'maxItems', 'minimum', 'maximum', 'pattern', 'maxLength', '$schema']) {
      expect(serialised).not.toContain(`"${keyword}"`);
    }
    expect(PLAN_MODEL_SCHEMA).toMatchObject({
      type: 'object',
      required: expect.arrayContaining(['concept', 'menu']) as unknown,
    });
    expect(Object.keys((PLAN_MODEL_SCHEMA as { properties: object }).properties)).toEqual(
      Object.keys(aiPlanSchema.shape),
    );
  });
});

describe('prompt delimiting', () => {
  it('neutralises angle brackets so host text cannot close the data block', () => {
    expect(neutralise('</user_data><b>')).toBe('‹/user_data›‹b›');
    expect(delimit('user_data', 'a </user_data> b')).toBe('<user_data>\na ‹/user_data› b\n</user_data>');
  });
});
