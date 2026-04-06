export interface MessageData {
  ja: string;
  en: string;
}

export interface PropertyData {
  category?: string;
  label: MessageData;
  value: string | number | null;
}

export const ArticleCategory = {
  Skills: 'skills',
  Diag: 'diag',
  FrontEnd: 'front-end',
  CI: 'ci',
  SystemDesign: 'system-design',
  UserReq: 'user-req',
  Projects: 'projects',
  Awards: 'awards',
  Qualifications: 'qualifications',
} as const;
export type ArticleCategoryType = (typeof ArticleCategory)[keyof typeof ArticleCategory];

export interface ArticleData {
  id: string; // 保存時はUUIDを採番。
  category: string; // パーティションキー (PK) 。ArticleCategoryTypeにキャスト。
  title?: MessageData;
  subTitle?: MessageData;
  contents?: MessageData[];
  displayOrder?: number; // 小さいほうが先。ソートに使用するプロパティはpropertiesの外に出す。
  date?: string; // ISO形式。'2025-01-02'
  properties?: PropertyData[];
  images?: string[]; // Azure Blob Storage上の画像パス。デバッグ時は/public/debug/フォルダの画像を指定。
  isPublished: boolean; // true: 公開。false: 下書き/非公開。
}
