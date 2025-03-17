import { generateText } from '../../lib/openai';

// OpenAIクライアントのモック
jest.mock('openai', () => {
  // モックの実装
  const mockCreate = jest.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: 'Generated text response',
        },
      },
    ],
  });

  // OpenAIクラスのモック
  function MockOpenAI() {
    return {
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    };
  }

  return MockOpenAI;
});

describe('OpenAI Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateText', () => {
    test('should generate text successfully', async () => {
      const prompt = 'Test prompt';
      const result = await generateText(prompt);

      expect(result).toBe('Generated text response');
    });

    test('should handle empty response', async () => {
      // モックの実装を上書き
      jest.mock(
        'openai',
        () => {
          function MockOpenAI() {
            return {
              chat: {
                completions: {
                  create: jest.fn().mockResolvedValue({
                    choices: [],
                  }),
                },
              },
            };
          }
          return MockOpenAI;
        },
        { virtual: true }
      );

      // モジュールキャッシュをクリア
      jest.resetModules();

      // モジュールを再インポート
      const openai = jest.requireActual('../../lib/openai');
      const { generateText } = openai;

      const result = await generateText('Test prompt');
      expect(result).toBe('');
    });

    test('should throw error when API fails', async () => {
      // モックの実装を上書き
      jest.mock(
        'openai',
        () => {
          function MockOpenAI() {
            return {
              chat: {
                completions: {
                  create: jest.fn().mockRejectedValue(new Error('API error')),
                },
              },
            };
          }
          return MockOpenAI;
        },
        { virtual: true }
      );

      // モジュールキャッシュをクリア
      jest.resetModules();

      // モジュールを再インポート
      const openai = jest.requireActual('../../lib/openai');
      const { generateText } = openai;

      await expect(generateText('Test prompt')).rejects.toThrow('API error');
    });
  });
});
