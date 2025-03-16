import { apiClient, ApiResponse } from './client';
import { AUTH_ENDPOINTS } from '../constants';

// 認証関連の型定義
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LogoutResponse {
  message: string;
}

// 認証サービス
export const authService = {
  // ユーザー登録
  async register(data: RegisterRequest): Promise<ApiResponse<User>> {
    return apiClient.post<User>(AUTH_ENDPOINTS.REGISTER, data);
  },

  // ログイン
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, data);

    // トークンをローカルストレージに保存
    if (response.data.token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.data.token);
    }

    return response;
  },

  // ログアウト
  async logout(): Promise<ApiResponse<LogoutResponse>> {
    const response = await apiClient.post<LogoutResponse>(AUTH_ENDPOINTS.LOGOUT);

    // ローカルストレージからトークンを削除
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }

    return response;
  },

  // 現在のユーザーがログインしているかチェック
  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  },

  // トークンを取得
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },
};
