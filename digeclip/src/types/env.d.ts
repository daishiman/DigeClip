declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase設定
    DATABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;

    // OpenAI API設定
    OPENAI_API_KEY: string;

    // Google Gemini API設定（オプション）
    GEMINI_API_KEY?: string;

    // Anthropic Claude API設定（オプション）
    CLAUDE_API_KEY?: string;

    // Discord通知設定
    DISCORD_WEBHOOK_URL: string;

    // Next.js環境設定
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_API_URL?: string;
  }
}
