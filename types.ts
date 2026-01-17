
export enum ContentType {
  VIDEO = 'video',
  AUDIO = 'audio',
  TEXT = 'text'
}

export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface DifyConfig {
  apiKey: string;
  baseUrl: string;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  url?: string;
  body?: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  content: ContentItem[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  chapters: Chapter[];
  category?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  progress?: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
