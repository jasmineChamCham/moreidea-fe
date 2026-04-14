import { api } from './api';

export interface ContentItem {
  id: string;
  title: string;
  platform: string;
  content: string;
  analysis: string;
  bodyLanguage: string;
  toneVoice: string;
  score: number;
  createdAt: string;
}

export const getContents = async (): Promise<ContentItem[]> => {
  const response = await api.get('/contents');
  return response.data;
};
