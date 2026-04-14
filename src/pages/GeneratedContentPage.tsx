import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Activity, MessageCircle, Mic, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function GeneratedContentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  // Using location.state for passing data, or defaulting to null
  const contentData = location.state?.contentData || null;

  if (!contentData) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">No content generated yet</h2>
        <Button onClick={() => navigate('/collect-relevant-ideas')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go back to Collect Ideas
        </Button>
      </div>
    );
  }

  const { title, platform, content, analysis, bodyLanguage, toneVoice, score } = contentData;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600">
            Generated Content
          </h1>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          {platform} Format
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-lg leading-relaxed bg-slate-50 p-6 rounded-lg border border-slate-100">
                {content}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed">{analysis}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Quality Score</span>
                <div className={`flex items-center gap-2 text-5xl font-bold ${getScoreColor(score)}`}>
                  {score}
                  <span className="text-2xl text-slate-400">/ 100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="w-4 h-4 text-yellow-500" />
                Body Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 text-sm leading-relaxed">{bodyLanguage}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mic className="w-4 h-4 text-purple-500" />
                Tone of Voice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 text-sm leading-relaxed">{toneVoice}</p>
            </CardContent>
          </Card>

          <Button className="w-full h-12 text-lg" variant="default" onClick={() => alert('Refine functionality coming soon!')}>
            <Sparkles className="w-5 h-5 mr-2" />
            Refine Result
          </Button>
        </div>
      </div>
    </div>
  );
}
