export type DbDataType = 'article' | 'experience' | 'qualification' | 'award' | 'card-lead';

export interface DbCommonData {
  id: string; // 保存時はUUIDを採番。
  pk: string; // パーティションキー。
  type: DbDataType;
  isPublished: boolean; // true: 公開。false: 下書き/非公開。
  displayOrder?: number; // 小さいほうが先。ソートに使用するプロパティはpropertiesの外に出す。
  date?: string; // ISO形式。'2025-01-02'
}

export interface MessageData {
  ja: string;
  en?: string;
}

export interface MessageBlockData {
  type: 'info';
  messages: MessageData[];
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
  list?: MessageData[];
  titleImage?: ImageData;
  images?: ImageData[];
  messageBlocks?: MessageBlockData[];
}

export interface ArticleData extends DbCommonData {
  type: 'article';
  paragraphs: ArticleParagraphData[];
}

export interface AchievementData {
  title?: MessageData;
  contents: MessageData[];
}

export interface ExperienceData extends DbCommonData {
  type: 'experience';
  role: MessageData;
  company: MessageData;
  term: MessageData;
  achievements: AchievementData[];
  images?: ImageData[];
}

export interface QualificationData extends DbCommonData {
  type: 'qualification';
  name: MessageData;
  year: number;
  notes: MessageData[];
  issuer?: string;
}
export interface AwardData extends DbCommonData {
  type: 'award';
  name: MessageData;
  year: number;
  notes: MessageData[];
  issuer?: string;
}

export interface CardLeadData extends DbCommonData {
  type: 'card-lead';
  catchCopy?: MessageData;
  messages: MessageData[];
}
