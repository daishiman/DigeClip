-- 開発環境用シードデータ
-- 注意: このファイルは開発環境専用です。本番環境では使用しないでください。

-- ユーザーテーブルのサンプルデータ
INSERT INTO "users" (id, email, name, created_at, updated_at)
VALUES
  ('1f8c3d4e-5b6a-7c8d-9e0f-1a2b3c4d5e6f', 'test@example.com', 'テストユーザー', NOW(), NOW()),
  ('2a3b4c5d-6e7f-8a9b-0c1d-2e3f4a5b6c7d', 'dev@example.com', '開発者ユーザー', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ソーステーブルのサンプルデータ
INSERT INTO "sources" (id, name, description, url, created_at, updated_at, user_id)
VALUES
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'テスト記事', 'テスト用の記事ソース', 'https://example.com/article1', NOW(), NOW(), '1f8c3d4e-5b6a-7c8d-9e0f-1a2b3c4d5e6f'),
  ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '開発ドキュメント', '開発用のドキュメントソース', 'https://example.com/dev-docs', NOW(), NOW(), '2a3b4c5d-6e7f-8a9b-0c1d-2e3f4a5b6c7d')
ON CONFLICT (id) DO NOTHING;

-- コンテンツテーブルのサンプルデータ
INSERT INTO "contents" (id, title, body, source_id, created_at, updated_at, user_id)
VALUES
  ('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'テスト要約', 'これはテスト記事の要約です。テスト用に作成されました。', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', NOW(), NOW(), '1f8c3d4e-5b6a-7c8d-9e0f-1a2b3c4d5e6f'),
  ('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '開発ドキュメント要約', 'これは開発ドキュメントの要約です。開発環境のテスト用に作成されました。', 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', NOW(), NOW(), '2a3b4c5d-6e7f-8a9b-0c1d-2e3f4a5b6c7d')
ON CONFLICT (id) DO NOTHING;

-- メモ：実際のスキーマに合わせて適宜調整してください。
-- テーブル名やカラム名はPrismaスキーマに合わせる必要があります。