import { apiClient, ApiResponse } from './client';
import { ADMIN_ENDPOINTS } from '../constants';

// ソース関連の型定義
export interface SourceDetail {
  id: string;
  name: string;
  url: string;
  type: 'RSS' | 'Website' | 'API';
  icon_url: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSourceRequest {
  name: string;
  url: string;
  type: 'RSS' | 'Website' | 'API';
  icon_url: string;
  description: string;
  is_active: boolean;
}

// 空のインターフェースを修正
// 型エイリアスを使用して、CreateSourceRequestと同じ型を参照する
export type UpdateSourceRequest = CreateSourceRequest;

// ソース検索パラメータ
export interface SourceSearchParams {
  page?: number;
  limit?: number;
  type?: string;
  is_active?: boolean;
  sort?: string;
  search?: string;
}

// 管理者サービス
export const adminService = {
  // ソース一覧を取得
  async getSources(params?: SourceSearchParams): Promise<ApiResponse<SourceDetail[]>> {
    return apiClient.get<SourceDetail[]>(ADMIN_ENDPOINTS.SOURCES, { params });
  },

  // ソース詳細を取得
  async getSourceDetail(id: string): Promise<ApiResponse<SourceDetail>> {
    return apiClient.get<SourceDetail>(ADMIN_ENDPOINTS.SOURCE_DETAIL(id));
  },

  // ソースを作成
  async createSource(data: CreateSourceRequest): Promise<ApiResponse<SourceDetail>> {
    return apiClient.post<SourceDetail>(ADMIN_ENDPOINTS.SOURCES, data);
  },

  // ソースを更新
  async updateSource(id: string, data: UpdateSourceRequest): Promise<ApiResponse<SourceDetail>> {
    return apiClient.put<SourceDetail>(ADMIN_ENDPOINTS.SOURCE_DETAIL(id), data);
  },

  // ソースを削除
  async deleteSource(id: string): Promise<void> {
    await apiClient.delete(ADMIN_ENDPOINTS.SOURCE_DETAIL(id));
  },
};
