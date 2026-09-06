import OpenAI from 'openai';

export interface LLMConfig {
  client: OpenAI | null;
  model: string;
}

export class LLMService {
  private static config: LLMConfig | null = null;

  static getClientAndModel(): LLMConfig {
    if (this.config) {
      return this.config;
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const modelOverride = process.env.LLM_MODEL;

    // Detect if OpenAI key is actually a Gemini API Key (starts with AIzaSy)
    const isOpenAIKeyGemini = !!(openaiKey && openaiKey.startsWith('AIzaSy'));

    if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
      this.config = {
        client: new OpenAI({
          apiKey: geminiKey,
          baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
        }),
        model: modelOverride || 'gemma-4-31b-it',
      };
      return this.config;
    }

    if (isOpenAIKeyGemini) {
      this.config = {
        client: new OpenAI({
          apiKey: openaiKey,
          baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
        }),
        model: modelOverride || 'gemma-4-31b-it',
      };
      return this.config;
    }

    if (openaiKey && openaiKey !== 'your_openai_api_key_here') {
      this.config = {
        client: new OpenAI({ apiKey: openaiKey }),
        model: modelOverride || 'gpt-3.5-turbo',
      };
      return this.config;
    }

    this.config = { client: null, model: '' };
    return this.config;
  }
}
