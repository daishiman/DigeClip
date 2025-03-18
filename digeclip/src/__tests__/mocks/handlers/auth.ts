/**
 * 認証APIのモックハンドラー
 */
import { rest } from 'msw';

export const authHandlers = [
  // ログインハンドラー
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: 'user-1',
          email: 'user1@example.com',
          name: 'ユーザー1',
        },
        token: 'mock-token-123',
      })
    );
  }),

  // ログアウトハンドラー
  rest.post('/api/auth/logout', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ success: true }));
  }),

  // ユーザー情報取得ハンドラー
  rest.get('/api/auth/user', (req, res, ctx) => {
    // 認証済みのリクエストをシミュレート
    const isAuthenticated = req.headers.get('Authorization') === 'Bearer mock-token-123';

    if (isAuthenticated) {
      return res(
        ctx.status(200),
        ctx.json({
          user: {
            id: 'user-1',
            email: 'user1@example.com',
            name: 'ユーザー1',
          },
        })
      );
    }

    // 未認証の場合は401エラー
    return res(ctx.status(401), ctx.json({ error: '認証されていません' }));
  }),

  // ユーザー登録ハンドラー
  rest.post('/api/auth/register', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        user: {
          id: 'new-user-1',
          email: 'newuser@example.com',
          name: '新規ユーザー',
        },
        token: 'mock-token-456',
      })
    );
  }),
];
