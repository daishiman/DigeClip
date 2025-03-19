-- 本番環境用シードデータ

-- テストユーザーの作成
INSERT INTO users (id, email, name, "createdAt", "updatedAt")
VALUES
  ('11111111-1111-1111-1111-111111111111', 'test-prod@example.com', 'テストユーザー（本番）', NOW(), NOW());

-- テストソースの作成
INSERT INTO sources (id, name, url, type, active, "userId", "createdAt", "updatedAt")
VALUES
  ('22222222-2222-2222-2222-222222222222', 'テスト YouTube チャンネル', 'https://www.youtube.com/channel/test-prod', 'youtube', true, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222223', 'テスト RSS フィード', 'https://example-prod.com/feed', 'rss', true, '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222224', 'テスト arXiv', 'https://arxiv.org/search-prod', 'arxiv', true, '11111111-1111-1111-1111-111111111111', NOW(), NOW());

-- YouTubeソース特有の情報
INSERT INTO youtube_sources (id, "channelId")
VALUES
  ('22222222-2222-2222-2222-222222222222', 'UCyyyyyyyyyyyyyyyyyyyyyyyy');

-- RSSソース特有の情報
INSERT INTO rss_sources (id, "feedUrl")
VALUES
  ('22222222-2222-2222-2222-222222222223', 'https://example-prod.com/feed.xml');

-- arXivソース特有の情報
INSERT INTO arxiv_sources (id, category, query)
VALUES
  ('22222222-2222-2222-2222-222222222224', 'cs.AI', 'machine learning production');

-- テストコンテンツの作成
INSERT INTO contents (id, title, description, url, "publishedAt", "fetchedAt", "sourceId")
VALUES
  ('33333333-3333-3333-3333-333333333333', 'テスト動画（本番）', 'これは本番環境用のテスト動画説明です', 'https://www.youtube.com/watch?v=test-prod1', NOW() - INTERVAL '2 days', NOW(), '22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-333333333334', 'テスト記事（本番）', 'これは本番環境用のテスト記事説明です', 'https://example-prod.com/article1', NOW() - INTERVAL '1 day', NOW(), '22222222-2222-2222-2222-222222222223'),
  ('33333333-3333-3333-3333-333333333335', 'テスト論文（本番）', 'これは本番環境用のテスト論文説明です', 'https://arxiv.org/abs/yyyy.yyyyy', NOW(), NOW(), '22222222-2222-2222-2222-222222222224');

-- AIモデルの作成
INSERT INTO ai_models (id, name, provider, version, "createdAt", "updatedAt")
VALUES
  ('44444444-4444-4444-4444-444444444444', 'GPT-4', 'OpenAI', '4.0', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444445', 'Claude', 'Anthropic', '3.0', NOW(), NOW());

-- サマリーデータの作成
INSERT INTO summaries (id, "contentId", "aiModelId", summary, stage, "createdAt", "updatedAt")
VALUES
  ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'この動画は人工知能の本番環境での利用についての概要を説明しています。', 'published', NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555556', '33333333-3333-3333-3333-333333333334', '44444444-4444-4444-4444-444444444445', 'この記事は本番環境でのプログラミング技術について解説しています。', 'published', NOW(), NOW());

-- タグの作成
INSERT INTO tags (id, name, "createdAt", "updatedAt")
VALUES
  ('66666666-6666-6666-6666-666666666666', 'AI（本番）', NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666667', 'プログラミング（本番）', NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666668', '研究（本番）', NOW(), NOW());

-- コンテンツとタグの関連付け
INSERT INTO content_tags ("contentId", "tagId", "createdAt")
VALUES
  ('33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', NOW()),
  ('33333333-3333-3333-3333-333333333334', '66666666-6666-6666-6666-666666666667', NOW()),
  ('33333333-3333-3333-3333-333333333335', '66666666-6666-6666-6666-666666666666', NOW()),
  ('33333333-3333-3333-3333-333333333335', '66666666-6666-6666-6666-666666666668', NOW());

-- アプリ設定
INSERT INTO app_settings (id, "userId", theme, language, notifications, "createdAt", "updatedAt")
VALUES
  ('77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'dark', 'ja', true, NOW(), NOW());

-- 通知データ
INSERT INTO notifications (id, "userId", type, message, read, "createdAt")
VALUES
  ('88888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'new_content', '新しいコンテンツが追加されました（本番）', false, NOW());