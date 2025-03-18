// Prismaクライアントの型定義
declare module '@prisma/client' {
  export interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Source {
    id: string;
    name: string;
    url: string;
    type: string;
    active: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    lastFetchedAt?: Date | null;
  }

  export interface Content {
    id: string;
    title: string;
    description?: string | null;
    url: string;
    publishedAt: Date;
    fetchedAt: Date;
    sourceId: string;
  }

  export interface Summary {
    id: string;
    contentId: string;
    aiModelId: string;
    summary: string;
    stage: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface AiModel {
    id: string;
    name: string;
    provider: string;
    version: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Notification {
    id: string;
    userId: string;
    type: string;
    message: string;
    read: boolean;
    createdAt: Date;
  }

  export interface Tag {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface ContentTag {
    contentId: string;
    tagId: string;
    createdAt: Date;
  }

  export interface AppSettings {
    id: string;
    userId: string;
    theme: string;
    language: string;
    notifications: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
}
