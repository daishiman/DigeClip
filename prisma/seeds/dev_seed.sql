-- 開発環境用シードデータ

-- テストユーザーの作成
INSERT INTO users (id, email, name, "createdAt", "updatedAt")
VALUES
  ('00000000-0000-0000-0000-000000000001', 'test@example.com', 'テストユーザー', NOW(), NOW());

-- テストソースの作成
INSERT INTO sources (id, name, url, type, active, "userId", "createdAt", "updatedAt")
VALUES
  ('10000000-0000-0000-0000-000000000001', 'テスト YouTube チャンネル', 'https://www.youtube.com/channel/test', 'youtube', true, '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000002', 'テスト RSS フィード', 'https://example.com/feed', 'rss', true, '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000003', 'テスト arXiv', 'https://arxiv.org/search', 'arxiv', true, '00000000-0000-0000-0000-000000000001', NOW(), NOW());

-- YouTubeソース特有の情報
INSERT INTO youtube_sources (id, "channelId")
VALUES
  ('10000000-0000-0000-0000-000000000001', 'UCxxxxxxxxxxxxxxxxxxxxxxx');

-- RSSソース特有の情報
INSERT INTO rss_sources (id, "feedUrl")
VALUES
  ('10000000-0000-0000-0000-000000000002', 'https://example.com/feed.xml');

-- arXivソース特有の情報
INSERT INTO arxiv_sources (id, category, query)
VALUES
  ('10000000-0000-0000-0000-000000000003', 'cs.AI', 'machine learning');

-- テストコンテンツの作成
INSERT INTO contents (id, title, description, url, "publishedAt", "fetchedAt", "sourceId")
VALUES
  ('20000000-0000-0000-0000-000000000001', 'テスト動画', 'これはテスト用の動画説明です', 'https://www.youtube.com/watch?v=test1', NOW() - INTERVAL '2 days', NOW(), '10000000-0000-0000-0000-000000000001'),
  ('20000000-0000-0000-0000-000000000002', 'テスト記事', 'これはテスト用の記事説明です', 'https://example.com/article1', NOW() - INTERVAL '1 day', NOW(), '10000000-0000-0000-0000-000000000002'),
  ('20000000-0000-0000-0000-000000000003', 'テスト論文', 'これはテスト用の論文説明です', 'https://arxiv.org/abs/xxxx.xxxxx', NOW(), NOW(), '10000000-0000-0000-0000-000000000003');

-- AIモデルの作成
INSERT INTO ai_models (id, name, provider, version, "createdAt", "updatedAt")
VALUES
  ('30000000-0000-0000-0000-000000000001', 'GPT-4', 'OpenAI', '4.0', NOW(), NOW()),
  ('30000000-0000-0000-0000-000000000002', 'Claude', 'Anthropic', '3.0', NOW(), NOW());

-- サマリーデータの作成
INSERT INTO summaries (id, "contentId", "aiModelId", summary, stage, "createdAt", "updatedAt")
VALUES
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'この動画は人工知能についての概要を説明しています。', 'published', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'この記事はプログラミング技術について解説しています。', 'published', NOW(), NOW());

-- タグの作成
INSERT INTO tags (id, name, "createdAt", "updatedAt")
VALUES
  ('50000000-0000-0000-0000-000000000001', 'AI', NOW(), NOW()),
  ('50000000-0000-0000-0000-000000000002', 'プログラミング', NOW(), NOW()),
  ('50000000-0000-0000-0000-000000000003', '研究', NOW(), NOW());

-- コンテンツとタグの関連付け
INSERT INTO content_tags ("contentId", "tagId", "createdAt")
VALUES
  ('20000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', NOW()),
  ('20000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002', NOW()),
  ('20000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000001', NOW()),
  ('20000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000003', NOW());

-- アプリ設定
INSERT INTO app_settings (id, "userId", theme, language, notifications, "createdAt", "updatedAt")
VALUES
  ('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'dark', 'ja', true, NOW(), NOW());

-- 通知データ
INSERT INTO notifications (id, "userId", type, message, read, "createdAt")
VALUES
  ('70000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'new_content', '新しいコンテンツが追加されました', false, NOW());