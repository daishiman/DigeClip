-- 開発環境用シードデータ
INSERT INTO sources (name, type) VALUES
  ('テスト YouTube チャンネル', 'youtube'),
  ('テスト RSS フィード', 'rss');

-- サンプルコンテンツの追加
INSERT INTO contents (source_id, title, content, url, published_at) VALUES
  ((SELECT id FROM sources WHERE name = 'テスト YouTube チャンネル'),
   'テスト動画タイトル',
   'これはテスト用の動画コンテンツです。開発環境でのテストに使用します。',
   'https://www.youtube.com/watch?v=dummy-id',
   now() - interval '1 day'),

  ((SELECT id FROM sources WHERE name = 'テスト RSS フィード'),
   'テスト記事タイトル',
   'これはテスト用の記事コンテンツです。開発環境でのテストに使用します。',
   'https://example.com/test-article',
   now() - interval '2 days');