import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './index';
import { ContentSearchParams } from './user';
import { SourceSearchParams, CreateSourceRequest, UpdateSourceRequest } from './admin';
import { LoginRequest, RegisterRequest } from './auth';

// ユーザー関連のクエリキー
export const userKeys = {
  all: ['contents'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: ContentSearchParams) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// 管理者関連のクエリキー
export const adminKeys = {
  all: ['sources'] as const,
  lists: () => [...adminKeys.all, 'list'] as const,
  list: (filters: SourceSearchParams) => [...adminKeys.lists(), filters] as const,
  details: () => [...adminKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminKeys.details(), id] as const,
};

// 認証関連のフック
export const useAuth = () => {
  const queryClient = useQueryClient();

  // ログイン
  const login = useMutation({
    mutationFn: (data: LoginRequest) => api.auth.login(data),
    onSuccess: () => {
      // ログイン成功時にキャッシュをクリア
      queryClient.invalidateQueries();
    },
  });

  // ログアウト
  const logout = useMutation({
    mutationFn: () => api.auth.logout(),
    onSuccess: () => {
      // ログアウト成功時にキャッシュをクリア
      queryClient.clear();
    },
  });

  // ユーザー登録
  const register = useMutation({
    mutationFn: (data: RegisterRequest) => api.auth.register(data),
  });

  return {
    login,
    logout,
    register,
    isLoggedIn: api.auth.isLoggedIn(),
    getToken: api.auth.getToken,
  };
};

// コンテンツ一覧を取得するフック
export const useContents = (params?: ContentSearchParams) => {
  return useQuery({
    queryKey: userKeys.list(params || {}),
    queryFn: () => api.user.getContents(params),
    staleTime: 5 * 60 * 1000, // 5分間キャッシュを新鮮に保つ
  });
};

// コンテンツ詳細を取得するフック
export const useContentDetail = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => api.user.getContentDetail(id),
    staleTime: 5 * 60 * 1000, // 5分間キャッシュを新鮮に保つ
  });
};

// ソース一覧を取得するフック
export const useSources = (params?: SourceSearchParams) => {
  return useQuery({
    queryKey: adminKeys.list(params || {}),
    queryFn: () => api.admin.getSources(params),
    staleTime: 5 * 60 * 1000, // 5分間キャッシュを新鮮に保つ
  });
};

// ソース詳細を取得するフック
export const useSourceDetail = (id: string) => {
  return useQuery({
    queryKey: adminKeys.detail(id),
    queryFn: () => api.admin.getSourceDetail(id),
    staleTime: 5 * 60 * 1000, // 5分間キャッシュを新鮮に保つ
  });
};

// ソースを作成するフック
export const useCreateSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSourceRequest) => api.admin.createSource(data),
    onSuccess: () => {
      // 作成成功時にソース一覧を再取得
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
    },
  });
};

// ソースを更新するフック
export const useUpdateSource = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSourceRequest) => api.admin.updateSource(id, data),
    onSuccess: () => {
      // 更新成功時にソース一覧と詳細を再取得
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminKeys.detail(id) });
    },
  });
};

// ソースを削除するフック
export const useDeleteSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.admin.deleteSource(id),
    onSuccess: () => {
      // 削除成功時にソース一覧を再取得
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
    },
  });
};
