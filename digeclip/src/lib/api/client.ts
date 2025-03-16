import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from '../constants';

// レスポンスの型定義
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    pages?: number;
  };
}

// エラーレスポンスの型定義
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

// APIエラーコード
export enum ApiErrorCode {
  BAD_REQUEST = 'E400',
  UNAUTHORIZED = 'E401',
  FORBIDDEN = 'E403',
  NOT_FOUND = 'E404',
  CONFLICT = 'E409',
  RATE_LIMIT = 'E429',
  SERVER_ERROR = 'E500',
  SERVICE_UNAVAILABLE = 'E503',
}

// APIクライアントクラス
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // リクエストインターセプター
    this.client.interceptors.request.use(
      config => {
        // ローカルストレージからトークンを取得
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

        // トークンがあれば、ヘッダーに追加
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      error => Promise.reject(error)
    );

    // レスポンスインターセプター
    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError<ApiError>) => {
        // エラーレスポンスの処理
        if (error.response) {
          const status = error.response.status;

          // 認証エラー（401）の場合、ログアウト処理
          if (status === 401) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('auth_token');
              // 必要に応じてログインページにリダイレクト
              // window.location.href = '/login';
            }
          }

          // エラーメッセージの整形
          const errorMessage = this.formatErrorMessage(error);

          // 開発環境ではコンソールにエラーを出力
          if (process.env.NODE_ENV !== 'production') {
            console.error(`API Error (${status}):`, errorMessage);
          }
        } else if (error.request) {
          // リクエストは送信されたがレスポンスがない場合
          console.error('No response received:', error.request);
        } else {
          // リクエスト設定中にエラーが発生した場合
          console.error('Request error:', error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  // エラーメッセージをフォーマット
  private formatErrorMessage(error: AxiosError<ApiError>): string {
    if (error.response?.data?.error) {
      const { message, details } = error.response.data.error;

      if (details) {
        const detailMessages = Object.entries(details)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(', ');
        return `${message} (${detailMessages})`;
      }

      return message;
    }

    // デフォルトのエラーメッセージ
    return error.message || 'Unknown error occurred';
  }

  // GETリクエスト
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  // POSTリクエスト
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // PUTリクエスト
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // PATCHリクエスト
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  // DELETEリクエスト
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

// シングルトンインスタンスをエクスポート
export const apiClient = new ApiClient();
