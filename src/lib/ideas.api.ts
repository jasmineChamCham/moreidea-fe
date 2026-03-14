import { api } from './api';

export interface Idea {
  id: string;
  person: string;
  quote: string;
  place?: string;
  photoUrl?: string;
  createdAt: string;
}

export const ideasApi = {
  getAll: async (): Promise<Idea[]> => {
    const { data } = await api.get('/ideas');
    return data;
  },
  create: async (payload: Partial<Idea>): Promise<Idea> => {
    const { data } = await api.post('/ideas', payload);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/ideas/${id}`);
  },
};
