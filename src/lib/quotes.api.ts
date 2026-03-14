import { api } from './api';

export interface Quote {
  id: string;
  mentor: string;
  quote: string;
  place?: string;
  photoUrl?: string;
  createdAt: string;
}

export const quotesApi = {
  getAll: async (): Promise<Quote[]> => {
    const { data } = await api.get('/quotes');
    return data;
  },
  create: async (payload: Partial<Quote>): Promise<Quote> => {
    const { data } = await api.post('/quotes', payload);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/quotes/${id}`);
  },
};

// Keep the existing mentor quotes functionality
export interface MentorQuote {
  id: string;
  mentorId: string;
  quote: string;
  meaning?: string;
  createdAt: string;
}

export const mentorQuotesApi = {
  getByMentorId: async (mentorId: string): Promise<MentorQuote[]> => {
    const { data } = await api.get(`/mentors/${mentorId}/quotes`);
    return data;
  },
  create: async (mentorId: string, payload: { quote: string; meaning?: string }): Promise<MentorQuote> => {
    const { data } = await api.post(`/mentors/${mentorId}/quotes`, payload);
    return data;
  },
  update: async (mentorId: string, quoteId: string, payload: { quote?: string; meaning?: string }): Promise<MentorQuote> => {
    const { data } = await api.patch(`/mentors/${mentorId}/quotes/${quoteId}`, payload);
    return data;
  },
  delete: async (mentorId: string, quoteId: string): Promise<void> => {
    await api.delete(`/mentors/${mentorId}/quotes/${quoteId}`);
  },
};
