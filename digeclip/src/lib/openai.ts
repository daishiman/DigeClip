import OpenAI from 'openai';
import { isTestEnvironment } from './constants';

// OpenAIクライアントの初期化
// テスト環境ではAPIキーを使用せずに初期化
let openai: OpenAI;

if (isTestEnvironment()) {
  openai = new OpenAI({
    apiKey: 'dummy-key-for-tests',
  });
} else {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * テキスト生成のためのヘルパー関数
 * @param prompt ユーザーからのプロンプト
 * @param options 追加オプション
 * @returns 生成されたテキスト
 */
export async function generateText(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}
) {
  const { model = 'gpt-4o', temperature = 0.7, max_tokens = 1000 } = options;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

/**
 * 要約生成のためのヘルパー関数
 * @param text 要約するテキスト
 * @param options 追加オプション
 * @returns 要約されたテキスト
 */
export async function generateSummary(
  text: string,
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    language?: string;
  } = {}
) {
  const { model = 'gpt-4o', temperature = 0.5, max_tokens = 500, language = '日本語' } = options;

  const prompt = `以下のテキストを${language}で要約してください。要約は簡潔で、重要なポイントを含むようにしてください：\n\n${text}`;

  return generateText(prompt, { model, temperature, max_tokens });
}

export default openai;
