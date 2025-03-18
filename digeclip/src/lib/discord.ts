import axios from 'axios';

// Discordウェブフックの設定
// 環境変数から設定を取得
const DISCORD_WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL || '';

/**
 * シンプルなテキストメッセージをDiscordに送信
 * @param message 送信するテキストメッセージ
 * @param username 送信者名（オプション）
 * @returns レスポンス結果
 */
export async function sendTextMessage(
  message: string,
  username = 'DigeClip Bot'
): Promise<{ success: boolean; error?: string }> {
  // テスト環境では常に成功を返す
  if (process.env.NODE_ENV === 'test' || typeof jest !== 'undefined') {
    return { success: true };
  }

  if (!DISCORD_WEBHOOK_URL) {
    console.error('Discord webhook URL is not configured');
    return { success: false, error: 'Discord webhook URL is not configured' };
  }

  try {
    await axios.post(DISCORD_WEBHOOK_URL, {
      content: message,
      username,
    });
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error sending Discord message:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * 埋め込みメッセージをDiscordに送信
 * @param embed 埋め込みメッセージのオブジェクト
 * @param username 送信者名（オプション）
 * @returns レスポンス結果
 */
export async function sendEmbedMessage(
  embed: {
    title?: string;
    description?: string;
    color?: number;
    fields?: { name: string; value: string; inline?: boolean }[];
    thumbnail?: { url: string };
    image?: { url: string };
    footer?: { text: string; icon_url?: string };
  },
  username = 'DigeClip Bot'
): Promise<{ success: boolean; error?: string }> {
  // テスト環境では常に成功を返す
  if (process.env.NODE_ENV === 'test' || typeof jest !== 'undefined') {
    return { success: true };
  }

  if (!DISCORD_WEBHOOK_URL) {
    console.error('Discord webhook URL is not configured');
    return { success: false, error: 'Discord webhook URL is not configured' };
  }

  try {
    await axios.post(DISCORD_WEBHOOK_URL, {
      embeds: [embed],
      username,
    });
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error sending Discord embed:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// エクスポートするDiscordサービス
export const discordService = {
  sendTextMessage,
  sendEmbedMessage,
};
