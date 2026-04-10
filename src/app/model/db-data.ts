export interface DbCommonData {
  id: string; // 保存時はUUIDを採番。
  pk: string; // パーティションキー。
  isPublished: boolean; // true: 公開。false: 下書き/非公開。
  displayOrder?: number; // 小さいほうが先。ソートに使用するプロパティはpropertiesの外に出す。
  date?: string; // ISO形式。'2025-01-02'
}

export interface MessageData {
  ja: string;
  en?: string;
}

export interface ImageData {
  path: string;
  caption?: MessageData;
  alt?: MessageData;
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

export interface ArticleParagraphData {
  title?: MessageData;
  subTitle?: MessageData;
  contents?: MessageData[];
  titleImage?: ImageData;
  images?: ImageData[];
}

export interface ArticleData extends DbCommonData {
  paragraphs: ArticleParagraphData[];
}
