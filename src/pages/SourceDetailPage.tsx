import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { sourcesApi, BookVideoSource, ExtractedIdea } from "@/lib/sources.api";
import { ArrowLeft, Lightbulb, Book, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: source, isLoading, error } = useQuery<BookVideoSource>({
    queryKey: ["source", id],
    queryFn: async () => {
      const sources = await sourcesApi.getAllSources();
      const source = sources.find(s => s.id === id);
      if (!source) {
        throw new Error('Source not found');
      }
      return source;
    },
    enabled: !!id,
  });

  const { data: ideas = [], isLoading: ideasLoading } = useQuery<ExtractedIdea[]>({
    queryKey: ["source", id, "ideas"],
    queryFn: () => sourcesApi.getIdeasBySource(id!),
    enabled: !!id,
  });

  if (isLoading || ideasLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !source) {
    return (
      <div className="container py-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Source not found</h2>
          <p className="text-muted-foreground mb-4">The source you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/mentors")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mentors
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 lg:py-10">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            {source.sourceType === 'book' ? (
              <Book className="h-6 w-6 text-primary" />
            ) : (
              <Video className="h-6 w-6 text-primary" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">{source.sourceTitle}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">
                {source.sourceType}
              </Badge>
              {source.creator && (
                <span className="text-muted-foreground">
                  by {source.creator}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Source Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <p className="capitalize">{source.sourceType}</p>
              </div>
              {source.creator && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Creator</label>
                  <p>{source.creator}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Ideas</label>
                <p>{ideas.length}</p>
              </div>
              {source.sourceUrl && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">URL</label>
                  <a 
                    href={source.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {source.sourceUrl}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ideas Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Ideas ({ideas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ideas.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No ideas found for this source.
                </p>
              ) : (
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                  {ideas.map((idea) => (
                    <div key={idea.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-lg leading-tight">
                          {idea.ideaText}
                        </h4>
                      </div>
                      
                      {(idea.core || idea.importance || idea.application || idea.example) && (
                        <Separator />
                      )}
                      
                      {idea.core && (
                        <div>
                          <h5 className="font-medium text-sm text-primary mb-1">Core Concept</h5>
                          <p className="text-sm text-muted-foreground">{idea.core}</p>
                        </div>
                      )}
                      
                      {idea.importance && (
                        <div>
                          <h5 className="font-medium text-sm text-primary mb-1">Importance</h5>
                          <p className="text-sm text-muted-foreground">{idea.importance}</p>
                        </div>
                      )}
                      
                      {idea.application && (
                        <div>
                          <h5 className="font-medium text-sm text-primary mb-1">Application</h5>
                          <p className="text-sm text-muted-foreground">{idea.application}</p>
                        </div>
                      )}
                      
                      {idea.example && (
                        <div>
                          <h5 className="font-medium text-sm text-primary mb-1">Example</h5>
                          <p className="text-sm text-muted-foreground">{idea.example}</p>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground pt-2 border-t">
                        Created: {new Date(idea.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
