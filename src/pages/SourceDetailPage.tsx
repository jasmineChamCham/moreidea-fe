import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { sourcesApi, BookVideoSource, ExtractedIdea } from "@/lib/sources.api";
import { ArrowLeft, Lightbulb, Book, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import IdeasTable from "@/components/get-ideas/IdeasTable";

export default function SourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
              {source.creator && (
                <span className="text-muted-foreground">
                  by {source.creator}
                </span>
              )}
              <span className="text-muted-foreground">
                {ideas.length} ideas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ideas Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Ideas ({ideas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <IdeasTable
            ideas={ideas}
            sourceId={source.id}
            sourceCreator={source.creator || null}
            sourceTitle={source.sourceTitle}
            onRefresh={() => queryClient.invalidateQueries({ queryKey: ["source", id, "ideas"] })}
          />
        </CardContent>
      </Card>
    </div>
  );
}
