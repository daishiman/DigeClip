-- 本番環境用シードデータ
-- 注意: このファイルは本番環境専用です。最小限のデータのみ含めています。

-- 管理者ユーザーのみを作成（必要に応じて）
INSERT INTO "users" (id, email, name, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@digeclip.com', '管理者', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 本番環境での初期設定（必要に応じて）
-- INSERT INTO "settings" (key, value, created_at, updated_at)
-- VALUES
--   ('default_language', 'ja', NOW(), NOW()),
--   ('default_theme', 'light', NOW(), NOW())
-- ON CONFLICT (key) DO NOTHING;

-- メモ：本番環境には必要最小限のデータのみ投入してください。
-- ユーザーデータやコンテンツデータは実際の利用を通じて作成されるべきです。