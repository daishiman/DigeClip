// APIクライアントとレスポンス型をエクスポート
export * from './client';

// 各サービスをエクスポート
export * from './auth';
export * from './user';
export * from './admin';

// React Queryフックをエクスポート
export * from './hooks';

// 便宜上、各サービスをオブジェクトとしてまとめる
import { authService } from './auth';
import { userService } from './user';
import { adminService } from './admin';

export const api = {
  auth: authService,
  user: userService,
  admin: adminService,
};
