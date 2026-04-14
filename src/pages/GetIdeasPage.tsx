import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Video, ExternalLink } from "lucide-react";
import { sourcesApi, BookVideoSource, ExtractedIdea } from "@/lib/sources.api";
import { Badge } from "@/components/ui/badge";
import NewSourceDialog from "@/components/get-ideas/NewSourceDialog";
import IdeasTable from "@/components/get-ideas/IdeasTable";

type Source = BookVideoSource;
type Idea = ExtractedIdea;

export default function GetIdeasPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const fetchSources = async () => {
    try {
      const data = await sourcesApi.getAllSources();
      setSources(data);
    } catch (err) {
      console.error("Failed to fetch sources", err);
    }
  };

  const fetchIdeas = async (sourceId: string) => {
    try {
      const data = await sourcesApi.getIdeasBySource(sourceId);
      setIdeas(data);
    } catch (err) {
      console.error("Failed to fetch ideas", err);
    }
  };

  useEffect(() => { fetchSources(); }, []);
  useEffect(() => { if (selectedSourceId) fetchIdeas(selectedSourceId); }, [selectedSourceId]);

  const selectedSource = sources.find(s => s.id === selectedSourceId);

  const handleSourceCreated = (sourceId: string) => {
    fetchSources();
    setSelectedSourceId(sourceId);
  };

  return (
    <div className="container py-6 lg:py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Extract Ideas
        </h1>
        <NewSourceDialog onSourceCreated={handleSourceCreated} />
      </div>

      {/* Source Selection */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-display">Select Source</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSourceId || ""} onValueChange={setSelectedSourceId}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Choose a book or video..." />
            </SelectTrigger>
            <SelectContent>
              {sources.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  <span className="flex items-center gap-2">
                    {s.sourceType === "book" ? (
                      <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <Video className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    {s.sourceTitle}
                    {s.creator && <span className="text-muted-foreground">— {s.creator}</span>}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Source Details + Ideas */}
      {selectedSource && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  {selectedSource.sourceType === "video" && selectedSource.sourceUrl ? (
                    <a
                      href={selectedSource.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                      title="Open video URL"
                    >
                      {selectedSource.sourceTitle}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    selectedSource.sourceTitle
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {selectedSource.sourceType === "book" ? "📖 Book" : "🎬 Video"}
                  </Badge>
                </CardTitle>
                {selectedSource.creator && (
                  <p className="text-sm text-muted-foreground">Creator: {selectedSource.creator}</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <IdeasTable
              ideas={ideas}
              sourceId={selectedSource.id}
              sourceCreator={selectedSource.creator || null}
              sourceTitle={selectedSource.sourceTitle}
              onRefresh={() => fetchIdeas(selectedSource.id)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
