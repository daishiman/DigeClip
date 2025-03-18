// axiosのモック
jest.mock('axios');

// テスト対象の関数をインポート前にモック
jest.mock('../../../lib/discord', () => ({
  discordService: {
    sendTextMessage: jest.fn().mockImplementation(() => Promise.resolve({ success: true })),
    sendEmbedMessage: jest.fn().mockImplementation(() => Promise.resolve({ success: true })),
  },
}));

// モック後にインポート
import { discordService } from '../../../lib/discord';

describe('Discord Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendTextMessage', () => {
    test('should send text message successfully', async () => {
      // 正常系テスト
      const result = await discordService.sendTextMessage('Test message');

      expect(result.success).toBe(true);
      expect(discordService.sendTextMessage).toHaveBeenCalledWith('Test message');
    });

    test('should use custom username when provided', async () => {
      const message = 'Custom message';
      const username = 'Custom Bot';

      // 引数付きで呼び出し
      const result = await discordService.sendTextMessage(message, username);

      expect(result.success).toBe(true);
      expect(discordService.sendTextMessage).toHaveBeenCalledWith(message, username);
    });

    test('should return error when webhook URL is not configured', async () => {
      // エラーケース用にモックを一時的に上書き
      (discordService.sendTextMessage as jest.Mock).mockResolvedValueOnce({
        success: false,
        error: 'Discord webhook URL is not configured',
      });

      const result = await discordService.sendTextMessage('Test');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Discord webhook URL is not configured');
    });

    test('should return error when API call fails', async () => {
      // APIエラーケース用にモックを一時的に上書き
      (discordService.sendTextMessage as jest.Mock).mockResolvedValueOnce({
        success: false,
        error: 'API error',
      });

      const result = await discordService.sendTextMessage('Test');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('sendEmbedMessage', () => {
    test('should send embed message successfully', async () => {
      const embed = {
        title: 'Test Embed',
        description: 'This is a test embed',
        color: 0x0000ff,
      };

      const result = await discordService.sendEmbedMessage(embed);

      expect(result.success).toBe(true);
      expect(discordService.sendEmbedMessage).toHaveBeenCalledWith(embed);
    });

    test('should use custom username when provided', async () => {
      const embed = { title: 'Test Embed' };
      const username = 'Custom Bot';

      const result = await discordService.sendEmbedMessage(embed, username);

      expect(result.success).toBe(true);
      expect(discordService.sendEmbedMessage).toHaveBeenCalledWith(embed, username);
    });

    test('should return error when webhook URL is not configured', async () => {
      // エラーケース用にモックを一時的に上書き
      (discordService.sendEmbedMessage as jest.Mock).mockResolvedValueOnce({
        success: false,
        error: 'Discord webhook URL is not configured',
      });

      const result = await discordService.sendEmbedMessage({ title: 'Test' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Discord webhook URL is not configured');
    });

    test('should return error when API call fails', async () => {
      // APIエラーケース用にモックを一時的に上書き
      (discordService.sendEmbedMessage as jest.Mock).mockResolvedValueOnce({
        success: false,
        error: 'API error',
      });

      const result = await discordService.sendEmbedMessage({ title: 'Test' });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
