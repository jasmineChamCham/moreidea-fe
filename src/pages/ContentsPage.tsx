import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Eye,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { getContents, ContentItem } from '@/lib/contents.api';
import { toast } from 'sonner';

export default function ContentsPage() {
  const navigate = useNavigate();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const data = await getContents();
        setContents(data);
      } catch (error) {
        toast.error('Failed to load contents');
        console.error('Error fetching contents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  const handleSelectContent = (content: ContentItem) => {
    // Navigate to generated content page with the selected content data
    navigate('/generated-content', { 
      state: { 
        contentData: content 
      } 
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    if (score >= 70) return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return 'border-red-500/30 bg-red-500/10 text-red-300';
      case 'tiktok':
        return 'border-pink-500/30 bg-pink-500/10 text-pink-300';
      default:
        return 'border-white/20 bg-white/5 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-400" />
          <p className="text-slate-400">Loading contents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Ambient glow layer */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(6,182,212,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 110%, rgba(59,130,246,0.12) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 50% 50%, rgba(168,85,247,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center justify-between backdrop-blur-sm bg-white/[0.02] rounded-2xl px-4 md:px-6 py-3 md:py-4 border border-white/[0.05] mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-200 text-sm group px-3 py-2 rounded-lg hover:bg-white/[0.05]"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse"></div>
            <h1 className="text-lg md:text-xl font-semibold font-display tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Contents
            </h1>
            <Badge variant="outline" className="border-white/20 bg-white/5 text-white text-xs">
              {contents.length} items
            </Badge>
          </div>
        </div>

        {/* Contents List */}
        {contents.length === 0 ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-300 mb-2">No contents yet</h2>
            <p className="text-slate-500 text-sm mb-4">Generate your first content to see it here.</p>
            <Button
              variant="outline"
              className="border-white/10 hover:bg-white/5"
              onClick={() => navigate('/collect-relevant-ideas')}
            >
              Generate Content
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {contents.map((content) => (
              <Card 
                key={content.id}
                className="border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm hover:from-white/[0.06] hover:to-white/[0.02] transition-all duration-300 cursor-pointer group"
                onClick={() => handleSelectContent(content)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getPlatformColor(content.platform)}>
                          {content.platform}
                        </Badge>
                        <Badge className={getScoreColor(content.score)}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {content.score}/100
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {content.title}
                      </CardTitle>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-1" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(content.createdAt)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectContent(content);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
