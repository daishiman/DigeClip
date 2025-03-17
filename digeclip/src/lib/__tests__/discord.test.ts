import { sendDiscordNotification, sendErrorNotification } from '../../lib/discord';
import axios from 'axios';

// axiosのモック
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Discord Client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // 環境変数のモック
    process.env = { ...originalEnv };
    process.env.DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/mock';

    // axiosのデフォルトモック
    mockedAxios.post.mockResolvedValue({ status: 204 });
  });

  afterEach(() => {
    // テスト後に環境変数を元に戻す
    process.env = originalEnv;
  });

  describe('sendDiscordNotification', () => {
    test('should send notification successfully', async () => {
      const content = 'Test notification';
      const result = await sendDiscordNotification(content);

      expect(result).toBe(true);
      expect(mockedAxios.post).toHaveBeenCalledWith('https://discord.com/api/webhooks/mock', {
        content,
        username: 'DigeClip Bot',
        avatar_url: 'https://i.imgur.com/AfFp7pu.png',
        embeds: [],
      });
    });

    test('should use custom options when provided', async () => {
      const content = 'Custom notification';
      const options = {
        username: 'Custom Bot',
        avatar_url: 'https://example.com/avatar.png',
        embeds: [{ title: 'Test Embed', description: 'Test description' }],
      };

      const result = await sendDiscordNotification(content, options);

      expect(result).toBe(true);
      expect(mockedAxios.post).toHaveBeenCalledWith('https://discord.com/api/webhooks/mock', {
        content,
        ...options,
      });
    });

    test('should return false when webhook URL is not configured', async () => {
      // 環境変数をクリア
      process.env = { ...originalEnv };
      process.env.DISCORD_WEBHOOK_URL = '';

      const result = await sendDiscordNotification('Test');

      expect(result).toBe(false);
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    test('should return false when API call fails', async () => {
      // エラーをモック
      mockedAxios.post.mockRejectedValueOnce(new Error('API error'));

      const result = await sendDiscordNotification('Test');

      expect(result).toBe(false);
    });
  });

  describe('sendErrorNotification', () => {
    test('should send error notification with Error object', async () => {
      // axiosのモックをリセット
      mockedAxios.post.mockReset();
      mockedAxios.post.mockResolvedValue({ status: 204 });

      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at test.js:1:1';
      const context = { userId: '123', action: 'test' };

      const result = await sendErrorNotification(error, context);

      expect(result).toBe(true);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://discord.com/api/webhooks/mock',
        expect.objectContaining({
          content: '',
          embeds: expect.arrayContaining([
            expect.objectContaining({
              title: '🚨 エラーが発生しました',
              color: 0xff0000,
              fields: expect.arrayContaining([
                { name: 'エラーメッセージ', value: 'Test error' },
                expect.objectContaining({
                  name: 'コンテキスト',
                  value: expect.stringContaining('userId'),
                }),
                expect.objectContaining({
                  name: 'スタックトレース',
                  value: expect.stringContaining('Error: Test error'),
                }),
              ]),
            }),
          ]),
        })
      );
    });

    test('should send error notification with string error', async () => {
      // axiosのモックをリセット
      mockedAxios.post.mockReset();
      mockedAxios.post.mockResolvedValue({ status: 204 });

      const result = await sendErrorNotification('String error message');

      expect(result).toBe(true);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://discord.com/api/webhooks/mock',
        expect.objectContaining({
          content: '',
          embeds: expect.arrayContaining([
            expect.objectContaining({
              fields: expect.arrayContaining([
                { name: 'エラーメッセージ', value: 'String error message' },
              ]),
            }),
          ]),
        })
      );
    });
  });
});
