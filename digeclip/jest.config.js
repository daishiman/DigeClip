/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/dist/'],
  // テストを実行するためにtestMatchを元に戻す
  testMatch: ['<rootDir>/src/__tests__/unit/**/*.test.{ts,tsx}'],
  // テスト環境のセットアップファイルを追加
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};

module.exports = config;
