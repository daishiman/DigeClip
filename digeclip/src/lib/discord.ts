import axios from 'axios';

/**
 * テスト環境かどうかを判定する関数
 * テスト実行中かつモック環境で実行されているかどうかをチェック
 */
const isTestEnvironment = (): boolean => {
  return (
    process.env.NODE_ENV === 'test' ||
    typeof jest !== 'undefined' ||
    process.env.JEST_WORKER_ID !== undefined
  );
};

/**
 * Discordウェブフックのエンドポイントを取得
 * 環境変数から設定値を安全に取得
 */
const getWebhookUrl = (): string => {
  return process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL || '';
};

/**
 * シンプルなテキストメッセージをDiscordに送信
 * @param message 送信するテキストメッセージ
 * @param username 送信者名（オプション）
 * @returns 処理結果を含むオブジェクト
 */
export async function sendTextMessage(
  message: string,
  username = 'DigeClip Bot'
): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = getWebhookUrl();

  // WebフックURLが設定されていない場合はエラー
  if (!webhookUrl) {
    console.error('Discord webhook URL is not configured');
    return { success: false, error: 'Discord webhook URL is not configured' };
  }

  try {
    // テスト環境とそれ以外で共通の実装を使用
    await axios.post(webhookUrl, {
      content: message,
      username,
    });
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // テスト環境以外の場合のみログ出力
    if (!isTestEnvironment()) {
      console.error('Error sending Discord message:', errorMessage);
    }

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
 * @returns 処理結果を含むオブジェクト
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
  const webhookUrl = getWebhookUrl();

  // WebフックURLが設定されていない場合はエラー
  if (!webhookUrl) {
    console.error('Discord webhook URL is not configured');
    return { success: false, error: 'Discord webhook URL is not configured' };
  }

  try {
    // テスト環境とそれ以外で共通の実装を使用
    await axios.post(webhookUrl, {
      embeds: [embed],
      username,
    });
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // テスト環境以外の場合のみログ出力
    if (!isTestEnvironment()) {
      console.error('Error sending Discord embed:', errorMessage);
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// エクスポートするDiscordサービス
// 外部からは単一のオブジェクトとしてアクセス可能に
export const discordService = {
  sendTextMessage,
  sendEmbedMessage,
};
