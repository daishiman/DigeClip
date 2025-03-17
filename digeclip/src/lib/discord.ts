import axios from 'axios';

// Discord Webhookの設定
const getWebhookUrl = () => process.env.DISCORD_WEBHOOK_URL || '';

/**
 * Discordに通知を送信する
 * @param content 送信するメッセージ内容
 * @param options 追加オプション
 * @returns 送信結果
 */
export async function sendDiscordNotification(
  content: string,
  options: {
    username?: string;
    avatar_url?: string;
    embeds?: Record<string, unknown>[];
  } = {}
) {
  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) {
    console.error('Discord webhook URL is not configured');
    return false;
  }

  const {
    username = 'DigeClip Bot',
    avatar_url = 'https://i.imgur.com/AfFp7pu.png', // デフォルトのアバター画像URL
    embeds = [],
  } = options;

  try {
    const payload = {
      content,
      username,
      avatar_url,
      embeds,
    };

    const response = await axios.post(webhookUrl, payload);
    return response.status === 204; // Discord APIは成功時に204を返す
  } catch (error) {
    console.error('Error sending Discord notification:', error);
    return false;
  }
}

/**
 * エラー通知をDiscordに送信する
 * @param error エラーオブジェクトまたはエラーメッセージ
 * @param context エラーが発生したコンテキスト情報
 * @returns 送信結果
 */
export async function sendErrorNotification(
  error: Error | string,
  context: Record<string, unknown> = {}
) {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : '';

  const embed = {
    title: '🚨 エラーが発生しました',
    color: 0xff0000, // 赤色
    fields: [
      {
        name: 'エラーメッセージ',
        value: errorMessage || 'エラーメッセージなし',
      },
      {
        name: 'コンテキスト',
        value:
          Object.entries(context)
            .map(([key, value]) => `**${key}**: ${JSON.stringify(value)}`)
            .join('\n') || 'コンテキストなし',
      },
    ],
    timestamp: new Date().toISOString(),
  };

  if (errorStack) {
    embed.fields.push({
      name: 'スタックトレース',
      value: `\`\`\`\n${errorStack.substring(0, 1000)}${errorStack.length > 1000 ? '...' : ''}\n\`\`\``,
    });
  }

  return sendDiscordNotification('', { embeds: [embed] });
}
