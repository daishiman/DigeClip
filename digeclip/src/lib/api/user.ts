import { apiClient, ApiResponse } from './client';
import { USER_ENDPOINTS } from '../constants';

// コンテンツ関連の型定義
export interface Source {
  id: string;
  name: string;
  icon_url: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface ContentSummary {
  id: string;
  title: string;
  source: Source;
  published_at: string;
  status: 'pending' | 'processing' | 'summarized' | 'failed';
  tags: Tag[];
}

export interface Model {
  id: string;
  name: string;
}

export interface Summary {
  id: string;
  type: 'short' | 'medium' | 'long';
  text: string;
  model: Model;
}

export interface ContentDetail extends ContentSummary {
  original_url: string;
  content_text: string;
  summaries: Summary[];
  created_at: string;
  updated_at: string;
}

// コンテンツ検索パラメータ
export interface ContentSearchParams {
  page?: number;
  limit?: number;
  status?: string;
  source_id?: string;
  sort?: string;
  search?: string;
}

// ユーザーサービス
export const userService = {
  // コンテンツ一覧を取得
  async getContents(params?: ContentSearchParams): Promise<ApiResponse<ContentSummary[]>> {
    return apiClient.get<ContentSummary[]>(USER_ENDPOINTS.CONTENTS, { params });
  },

  // コンテンツ詳細を取得
  async getContentDetail(id: string): Promise<ApiResponse<ContentDetail>> {
    return apiClient.get<ContentDetail>(USER_ENDPOINTS.CONTENT_DETAIL(id));
  },
};
