# タグ一覧取得 API

- **HTTPメソッド**: `GET`
- **エンドポイント**: `/api/user/tags`
- **機能概要**: 利用可能なタグの一覧を取得
- **認証要否**: **要**(user/admin)

## レスポンス

**Response**: `IUserGetTagsResponse`
```ts
export interface ITagItem {
  id: number;
  name: string;
  color?: string;
}

export interface IUserGetTagsResponse {
  tags: ITagItem[];
}
```

**例 (レスポンスJSON)**
```jsonc
{
  "tags": [
    {
      "id": 1,
      "name": "AI",
      "color": "#FF5733"
    },
    {
      "id": 2,
      "name": "プログラミング",
      "color": "#33A8FF"
    },
    {
      "id": 3,
      "name": "ビジネス",
      "color": "#33FF57"
    }
  ]
}
```