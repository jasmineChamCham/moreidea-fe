import { api, apiUpload } from './api';

export interface ExtractedIdea {
  id: string;
  sourceId: string;
  topicId?: string;
  ideaText: string;
  core?: string;
  importance?: string;
  application?: string;
  example?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookVideoSource {
  id: string;
  sourceTitle: string;
  sourceType: 'book' | 'video';
  creator?: string;
  sourceUrl?: string;
  filePath?: string;
  createdAt: string;
  _count?: { ideas: number };
}

export const sourcesApi = {
  getAllSources: async (): Promise<BookVideoSource[]> => {
    const { data } = await api.get('/sources');
    return data;
  },
  
  createVideoSource: async (sourceUrl: string, sourceTitle?: string): Promise<BookVideoSource> => {
    const { data } = await api.post('/sources/video', { sourceUrl, sourceTitle });
    return data;
  },

  createBookSource: async (pdfFile: File): Promise<BookVideoSource> => {
    const formData = new FormData();
    formData.append('file', pdfFile);
    const { data } = await apiUpload.post('/sources/book', formData);
    return data;
  },

  deleteSource: async (id: string): Promise<void> => {
    await api.delete(`/sources/${id}`);
  },

  getIdeasBySource: async (sourceId: string): Promise<ExtractedIdea[]> => {
    const { data } = await api.get(`/sources/${sourceId}/ideas`);
    return data;
  },

  createIdea: async (sourceId: string, payload: Partial<ExtractedIdea>): Promise<ExtractedIdea> => {
    const { data } = await api.post('/source-ideas', { sourceId, ...payload });
    return data;
  },

  updateIdea: async (ideaId: string, payload: Partial<ExtractedIdea>): Promise<ExtractedIdea> => {
    const { data } = await api.patch(`/source-ideas/${ideaId}`, payload);
    return data;
  },

  deleteIdea: async (ideaId: string): Promise<void> => {
    await api.delete(`/source-ideas/${ideaId}`);
  }
};
