import React, { useState } from 'react';
import { Search, Brain, User, MessageSquare, BookOpen, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface SearchResult {
  id: string;
  type: 'quote' | 'sourceIdea';
  quote?: string;
  ideaText?: string;
  core?: string;
  importance?: string;
  mentorName: string;
  style?: string;
  speakingStyle?: string;
  bodyLanguage?: string;
  sourceTitle?: string;
  sourceType?: string;
  similarity: number;
  createdAt: string;
}

const CollectRelevantIdeasPage: React.FC = () => {
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
            <Badge variant="outline" className="text-sm">
              Sorted by relevance
            </Badge>
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
                    <div className="text-lg font-medium">
                      {result.type === 'quote' ? result.quote : result.ideaText}
                    </div>

                    {result.core && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <span className="font-semibold text-blue-800">Core:</span> {result.core}
                      </div>
                    )}

                    {result.importance && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <span className="font-semibold text-green-800">Importance:</span> {result.importance}
                      </div>
                    )}

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Mentor:
                        </span>{' '}
                        {result.mentorName}
                      </div>

                      {result.style && (
                        <div>
                          <span className="font-semibold">Style:</span> {result.style}
                        </div>
                      )}

                      {result.speakingStyle && (
                        <div>
                          <span className="font-semibold">Speaking Style:</span> {result.speakingStyle}
                        </div>
                      )}

                      {result.bodyLanguage && (
                        <div>
                          <span className="font-semibold">Body Language:</span> {result.bodyLanguage}
                        </div>
                      )}

                      {result.sourceTitle && (
                        <div className="md:col-span-2">
                          <span className="font-semibold">Source:</span> {result.sourceTitle}
                          {result.sourceType && (
                            <Badge variant="outline" className="ml-2">
                              {result.sourceType}
                            </Badge>
                          )}
                        </div>
                      )}
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
