import { api } from './api';
import { Topic } from './topics.api';
import { MentorQuote } from './quotes.api';
import { BookVideoSource } from './sources.api';

export interface Mentor {
  id: string;
  name: string;
  avatarUrl?: string;
  archetype?: string;
  philosophy?: string;
  mindset?: string;
  style?: string;
  speakingStyle?: string;
  bodyLanguage?: string;
  bio?: string;
  era?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorDetail extends Mentor {
  topics: Topic[];
  quotes: MentorQuote[];
  sources: BookVideoSource[];
}

export const mentorsApi = {
  getAll: async (): Promise<Mentor[]> => {
    const { data } = await api.get('/mentors');
    return data;
  },
  getById: async (id: string): Promise<Mentor> => {
    const { data } = await api.get(`/mentors/${id}`);
    return data;
  },
  getDetails: async (id: string): Promise<MentorDetail> => {
    const { data } = await api.get(`/mentors/${id}/details`);
    return data;
  },
  create: async (payload: Partial<Mentor>): Promise<Mentor> => {
    const { data } = await api.post('/mentors', payload);
    return data;
  },
  update: async (id: string, payload: Partial<Mentor>): Promise<Mentor> => {
    const { data } = await api.patch(`/mentors/${id}`, payload);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/mentors/${id}`);
  },
  generateData: async (name: string): Promise<Partial<Mentor>> => {
    const { data } = await api.post('/mentors/generate', { name });
    return data;
  },
};
