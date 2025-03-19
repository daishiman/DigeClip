import OpenAI from 'openai';
import { isTestEnvironment } from './constants';

// OpenAIクライアントの初期化関数
const initializeOpenAI = () => {
  // テスト環境の場合
  if (isTestEnvironment()) {
    return new OpenAI({
      apiKey: 'dummy-key-for-tests',
    });
  }

  try {
    // サーバーサイドの場合のみ環境変数にアクセス
    if (typeof window === 'undefined') {
      try {
        // 環境変数が存在するか確認
        if (typeof process !== 'undefined' && process.env) {
          const apiKey = process.env.OPENAI_API_KEY;
          if (apiKey) {
            // 正常なクライアント初期化
            return new OpenAI({
              apiKey,
            });
          }
        }
        console.warn('OPENAI_API_KEY is not defined, using placeholder key');
      } catch (e) {
        console.warn('環境変数OPENAI_API_KEYの取得中にエラーが発生しました', e);
      }

      // ビルド時にエラーを起こさないためのダミーキー
      return new OpenAI({
        apiKey: 'sk-placeholder-key-for-build',
      });
    } else {
      // クライアントサイドの場合の処理
      console.warn('OpenAI client initialization attempted in browser environment');
      return new OpenAI({
        apiKey: 'sk-placeholder-key-for-client-side',
      });
    }
  } catch (error) {
    console.error('OpenAIクライアントの初期化に失敗しました:', error);
    // エラーハンドリングのためのフォールバック
    return new OpenAI({
      apiKey: 'sk-placeholder-key-for-build',
    });
  }
};

// クライアントを初期化
const openai = initializeOpenAI();

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

    // テスト環境の場合は例外をスロー
    // 安全な方法でテスト環境を判定
    let isTestEnv = false;
    try {
      if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
        isTestEnv = true;
      }
    } catch (e) {
      console.warn('process.env.NODE_ENVの取得中にエラーが発生しました', e);
    }

    // isTestEnvironmentを利用
    try {
      if (isTestEnv || isTestEnvironment()) {
        throw error;
      }
    } catch (e) {
      console.warn('テスト環境判定中にエラーが発生しました', e);
    }

    // 本番環境ではエラーメッセージを返す
    return 'APIリクエストの処理中にエラーが発生しました。';
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
