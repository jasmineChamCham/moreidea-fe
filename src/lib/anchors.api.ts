const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Anchor {
  id: string;
  content: string;
  category: string;
  createdAt: string;
}

export const anchorsApi = {
  getAll: async (): Promise<Anchor[]> => {
    const response = await fetch(`${API_BASE}/anchors`);
    if (!response.ok) {
      throw new Error('Failed to fetch anchors');
    }
    return response.json();
  },

  searchRelated: async (searchText: string): Promise<Anchor[]> => {
    const response = await fetch(`${API_BASE}/anchors/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchText }),
    });
    if (!response.ok) {
      throw new Error('Failed to search related anchors');
    }
    return response.json();
  },
};
