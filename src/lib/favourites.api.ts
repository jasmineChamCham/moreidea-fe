import { api } from './api';

export interface FavouriteIdea {
  id: string;
  person: string;
  quote: string;
  place?: string;
  photoUrl?: string;
  createdAt: string;
}

export const favouritesApi = {
  getAll: async (): Promise<FavouriteIdea[]> => {
    const { data } = await api.get('/favourite-ideas');
    return data;
  },
  create: async (payload: Partial<FavouriteIdea>): Promise<FavouriteIdea> => {
    const { data } = await api.post('/favourite-ideas', payload);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/favourite-ideas/${id}`);
  },
};
