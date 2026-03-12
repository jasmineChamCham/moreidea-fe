import { api } from './api';

export interface Topic {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const topicsApi = {
  getAll: async (): Promise<Topic[]> => {
    const { data } = await api.get('/topics');
    return data;
  },
  create: async (name: string): Promise<Topic> => {
    const { data } = await api.post('/topics', { name });
    return data;
  },
  update: async (id: string, name: string): Promise<Topic> => {
    const { data } = await api.patch(`/topics/${id}`, { name });
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/topics/${id}`);
  },
};
