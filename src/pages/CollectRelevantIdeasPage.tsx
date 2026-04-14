import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Brain, User, MessageSquare, BookOpen, Star, CheckSquare, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const [selectedIdeas, setSelectedIdeas] = useState<SearchResult[]>([]);
  
  // Generation state
  const [isGenerationDialogOpen, setIsGenerationDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('youtube');
  
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

  const toggleSelection = (result: SearchResult) => {
    setSelectedIdeas(prev => {
      const isSelected = prev.some(item => item.id === result.id);
      if (isSelected) {
        return prev.filter(item => item.id !== result.id);
      } else {
        return [...prev, result];
      }
    });
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

  const handleGenerateContent = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    try {
      // Create a simplified version of the ideas to send to the backend
      const payloadIdeas = selectedIdeas.map(r => ({
        type: r.type,
        text: r.type === 'quote' ? r.quote : r.ideaText,
        core: r.core,
        importance: r.importance,
        application: r.application,
        mentorName: r.mentorName
      }));

      const response = await api.post('/gemini/generate-content', {
        topic,
        platform,
        ideas: payloadIdeas
      });

      // Close dialog and reset
      setIsGenerationDialogOpen(false);
      
      // Navigate to generated content page passing the data via state
      navigate('/generated-content', { state: { contentData: response.data } });
      
    } catch (error) {
      console.error('Generation err:', error);
      toast.error('Failed to generate content. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl pb-24">
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
            {results.map((result, index) => {
              const isSelected = selectedIdeas.some(item => item.id === result.id);
              
              return (
                <Card 
                  key={`${result.type}-${result.id}`} 
                  className={`transition-all cursor-pointer border-2 ${
                    isSelected ? 'border-purple-500 bg-purple-50/10' : 'border-transparent hover:shadow-md'
                  }`}
                  onClick={() => toggleSelection(result)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={isSelected}
                          onCheckedChange={() => toggleSelection(result)}
                          className="w-5 h-5"
                          onClick={(e) => e.stopPropagation()}
                        />
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

                    <div className="space-y-3 pl-8">
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
                            <span className="text-yellow-600">
                              {result.sourceTitle}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 ml-4">
                          <Badge variant="outline" className="bg-slate-800 text-slate-300">
                            <User className="w-3 h-3 mr-1" />
                            {result.mentorName}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Bottom Bar */}
      {selectedIdeas.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg flex justify-between items-center z-50 animate-in slide-in-from-bottom-5">
          <div className="container mx-auto max-w-6xl flex justify-between items-center md:px-0">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 text-purple-700 font-bold px-4 py-2 rounded-full flex items-center">
                <CheckSquare className="w-4 h-4 mr-2" />
                {selectedIdeas.length} Selected
              </div>
              <span className="text-slate-500 hidden sm:inline text-sm">Use these ideas to generate a post, script, or analysis.</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setSelectedIdeas([])}>
                Clear Selection
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 font-bold text-white px-6"
                onClick={() => setIsGenerationDialogOpen(true)}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Content
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isGenerationDialogOpen} onOpenChange={setIsGenerationDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Generate Content</DialogTitle>
            <DialogDescription>
              We'll use your {selectedIdeas.length} selected ideas and your persistent speaking identity to generate content.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="topic">What do you want to talk about?</Label>
              <Input
                id="topic"
                placeholder="e.g. Staring at that 'Ok' text for 2 hours? Let's talk about Anxious Attachment."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="platform">Platform Format</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube (Long form, deeper dive)</SelectItem>
                  <SelectItem value="tiktok">TikTok / Shorts (Short form, punchy)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerationDialogOpen(false)} disabled={isGenerating}>Cancel</Button>
            <Button onClick={handleGenerateContent} disabled={isGenerating || !topic.trim()}>
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollectRelevantIdeasPage;
