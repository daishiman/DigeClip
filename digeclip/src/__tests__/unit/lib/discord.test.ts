import { discordService } from '../../../lib/discord';
import axios from 'axios';

// constantsのモック
jest.mock('../../../lib/constants', () => ({
  AUTH_ENDPOINTS: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  API_BASE_URL: 'http://mock-api',
}));

// axiosのモック
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Discord Client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // 環境変数のモック
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/mock';

    // axiosのデフォルトモック
    mockedAxios.post.mockResolvedValue({ status: 204 });
  });

  afterEach(() => {
    // テスト後に環境変数を元に戻す
    process.env = originalEnv;
  });

  describe('sendTextMessage', () => {
    test('should send text message successfully', async () => {
      const message = 'Test message';
      const result = await discordService.sendTextMessage(message);

      expect(result.success).toBe(true);
      expect(mockedAxios.post).toHaveBeenCalledWith('https://discord.com/api/webhooks/mock', {
        content: message,
        username: 'DigeClip Bot',
      });
    });

    test('should use custom username when provided', async () => {
      const message = 'Custom message';
      const username = 'Custom Bot';

      const result = await discordService.sendTextMessage(message, username);

      expect(result.success).toBe(true);
      expect(mockedAxios.post).toHaveBeenCalledWith('https://discord.com/api/webhooks/mock', {
        content: message,
        username,
      });
    });

    test('should return error when webhook URL is not configured', async () => {
      // 環境変数をクリア
      process.env = { ...originalEnv };
      process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL = '';

      const result = await discordService.sendTextMessage('Test');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Discord webhook URL is not configured');
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    test('should return error when API call fails', async () => {
      // エラーをモック
      mockedAxios.post.mockRejectedValueOnce(new Error('API error'));

      const result = await discordService.sendTextMessage('Test');

      expect(result.success).toBe(false);
      expect(result.error).toBe('API error');
    });
  });

  describe('sendEmbedMessage', () => {
    test('should send embed message successfully', async () => {
      const embed = {
        title: 'Test Embed',
        description: 'Test description',
        color: 0xff0000,
        fields: [
          { name: 'Field 1', value: 'Value 1' },
          { name: 'Field 2', value: 'Value 2' },
        ],
      };

      const result = await discordService.sendEmbedMessage(embed);

      expect(result.success).toBe(true);
      expect(mockedAxios.post).toHaveBeenCalledWith('https://discord.com/api/webhooks/mock', {
        embeds: [embed],
        username: 'DigeClip Bot',
      });
    });

    test('should use custom username when provided', async () => {
      const embed = { title: 'Test Embed' };
      const username = 'Custom Bot';

      const result = await discordService.sendEmbedMessage(embed, username);

      expect(result.success).toBe(true);
      expect(mockedAxios.post).toHaveBeenCalledWith('https://discord.com/api/webhooks/mock', {
        embeds: [embed],
        username,
      });
    });

    test('should return error when webhook URL is not configured', async () => {
      // 環境変数をクリア
      process.env = { ...originalEnv };
      process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL = '';

      const result = await discordService.sendEmbedMessage({ title: 'Test' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Discord webhook URL is not configured');
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    test('should return error when API call fails', async () => {
      // エラーをモック
      mockedAxios.post.mockRejectedValueOnce(new Error('API error'));

      const result = await discordService.sendEmbedMessage({ title: 'Test' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('API error');
    });
  });
});
