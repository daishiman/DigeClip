/**
 * テスト用ユーティリティ関数
 *
 * このファイルには、テストで共通して使用するヘルパー関数やモックデータを定義します。
 */

import { jest, beforeAll, afterAll } from "@jest/globals";

// モックデータ
export const mockUser = {
  id: "user-1",
  name: "テストユーザー",
  email: "test@example.com",
  isActive: true,
};

export const mockContent = {
  id: "content-1",
  title: "テストコンテンツ",
  body: "これはテスト用のコンテンツです。",
  createdAt: "2023-01-01T00:00:00Z",
};

// テスト用ヘルパー関数
export function createMockResponse() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
}

export function createMockRequest(overrides = {}) {
  return {
    body: {},
    query: {},
    params: {},
    headers: {},
    ...overrides,
  };
}

// 環境変数のモック
export function mockEnv(envVars: Record<string, string>) {
  const originalEnv = process.env;

  beforeAll(() => {
    process.env = {
      ...originalEnv,
      ...envVars,
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });
}
