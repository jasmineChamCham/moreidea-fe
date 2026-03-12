import { api } from './api';

export interface MentorQuote {
  id: string;
  mentorId: string;
  quote: string;
  meaning?: string;
  createdAt: string;
}

export const quotesApi = {
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
