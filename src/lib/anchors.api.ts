import { api } from './api';

export interface Anchor {
  id: string;
  content: string;
  category: string;
  createdAt: string;
}

interface RelatedAnchorResponse {
  id: string;
  version: number;
  score: number;
  payload: {
    text: string;
    category: string;
    content: string;
    createdAt: string;
    type: string;
  };
}

export const anchorsApi = {
  getAll: async (): Promise<Anchor[]> => {
    const response = await api.get('/anchors');
    return response.data.anchors || [];
  },

  searchRelated: async (searchText: string): Promise<Anchor[]> => {
    const response = await api.post('/anchors/search', { searchText });
    return (response.data.relatedAnchors || []).map((anchor: RelatedAnchorResponse) => ({
      id: anchor.id,
      content: anchor.payload.content,
      category: anchor.payload.category,
      createdAt: anchor.payload.createdAt,
    }));
  },
};
