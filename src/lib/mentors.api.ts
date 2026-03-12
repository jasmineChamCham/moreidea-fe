import { api } from './api';

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

export const mentorsApi = {
  getAll: async (): Promise<Mentor[]> => {
    const { data } = await api.get('/mentors');
    return data;
  },
  getById: async (id: string): Promise<Mentor> => {
    const { data } = await api.get(`/mentors/${id}`);
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
