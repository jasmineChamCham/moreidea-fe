import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Brain, User, MessageSquare, BookOpen, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { api } from '@/lib/api';

enum SearchContentType {
  QUOTE = 'quote',
  SOURCE_IDEA = 'source_idea'
}

interface SearchResult {
  id: string;
  type: SearchContentType;
  quote?: string;
  ideaText?: string;
  core?: string;
  importance?: string;
  application?: string;
  example?: string;
  mentorId: string;
  mentorName: string;
  style?: string;
  speakingStyle?: string;
  bodyLanguage?: string;
  sourceTitle?: string;
  sourceType?: string;
  similarity: number;
  createdAt: string;
  sourceUrl?: string;
}

const CollectRelevantIdeasPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/semantic-search/search', {
        query,
        limit: 100
      });
      setResults(response.data);
      toast.success(`Found ${response.data.length} relevant items`);
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Failed to search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSearch();
    }
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity > 0.8) return 'bg-green-100 text-green-800';
    if (similarity > 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getSimilarityLabel = (similarity: number) => {
    if (similarity > 0.8) return 'Very Relevant';
    if (similarity > 0.6) return 'Relevant';
    return 'Less Relevant';
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Brain className="w-10 h-10 text-purple-600" />
          Collect Relevant Ideas
        </h1>
        <p className="text-gray-600 text-lg">
          Discover quotes and ideas that resonate with your psychological journey
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search for Relevant Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="e.g., Self-worth, Finding inner peace, Overcoming fear..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-between items-center">
              <Button
                onClick={handleSearch}
                disabled={isLoading || !query.trim()}
                className="px-6"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Found {results.length} Relevant Items
            </h2>
          </div>

          <div className="grid gap-4">
            {results.map((result, index) => (
              <Card key={`${result.type}-${result.id}`} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {result.type === 'quote' ? (
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-green-600" />
                      )}
                      <Badge variant="secondary">
                        {result.type === 'quote' ? 'Quote' : 'Source Idea'}
                      </Badge>
                      <Badge className={getSimilarityColor(result.similarity)}>
                        <Star className="w-3 h-3 mr-1" />
                        {getSimilarityLabel(result.similarity)} ({(result.similarity * 100).toFixed(1)}%)
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {result.type === SearchContentType.SOURCE_IDEA && result.ideaText && (
                      <div className="text-lg font-medium text-blue-900 bg-blue-50 p-4 rounded-lg border border-blue-200">
                        {result.ideaText}
                      </div>
                    )}

                    {result.type === SearchContentType.QUOTE && result.quote && (
                      <div className="text-lg font-medium">
                        {result.quote}
                      </div>
                    )}

                    {result.core && (
                      <div className="bg-slate-100 p-3 rounded-lg border border-slate-200">
                        <span className="font-semibold text-slate-900">Core:</span> <span className="text-slate-800">{result.core}</span>
                      </div>
                    )}

                    {(result.importance || result.application) && (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                        {result.importance && (
                          <div>
                            <span className="font-semibold text-gray-900">Importance:</span> <span className="text-gray-800">{result.importance}</span>
                          </div>
                        )}
                        {result.application && (
                          <div>
                            <span className="font-semibold text-gray-900">Application:</span> <span className="text-gray-800">{result.application}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between text-sm">
                      {result.sourceTitle && (
                        <div className="flex-1">
                          <span className="font-semibold">Source:</span>{' '}
                          <a
                            href={result.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-600 hover:text-yellow-700 hover:underline"
                          >
                            {result.sourceTitle}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => navigate(`/mentors/${result.mentorId}`)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 text-slate-300 text-sm font-medium rounded-full hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <User className="w-3 h-3" />
                          {result.mentorName}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectRelevantIdeasPage;
