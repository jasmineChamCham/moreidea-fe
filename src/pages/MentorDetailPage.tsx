import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { mentorsApi, MentorDetail } from "@/lib/mentors.api";
import { ArrowLeft, BookOpen, MessageSquare, FolderOpen, Play, FileText, Calendar, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MentorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: mentor, isLoading, error } = useQuery<MentorDetail>({
    queryKey: ["mentor", id, "details"],
    queryFn: () => mentorsApi.getDetails(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="container py-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Mentor not found</h2>
          <p className="text-muted-foreground mb-4">The mentor you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/mentors")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mentors
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container py-6 lg:py-10">
          <Button
            variant="ghost"
            onClick={() => navigate("/mentors")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mentors
          </Button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {mentor.avatarUrl ? (
              <img
                src={mentor.avatarUrl}
                alt={mentor.name}
                className="h-24 w-24 rounded-full object-cover border-4 border-background shadow-lg"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-background shadow-lg">
                <span className="text-2xl font-bold text-primary">
                  {mentor.name.charAt(0)}
                </span>
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <h1 className="text-3xl font-display font-bold">{mentor.name}</h1>
                {mentor.archetype && (
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {mentor.archetype}
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{mentor.topics.length} Topics</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{mentor.quotes.length} Quotes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  <span>{mentor.sources.length} Sources</span>
                </div>
              </div>
            </div>
          </div>

          {/* Topics */}
          {mentor.topics.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {mentor.topics.map((topic) => (
                  <Badge key={topic.id} variant="outline" className="hover:bg-primary/10 transition-colors">
                    {topic.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* About Mentor Info - Horizontal Layout */}
          {(mentor.bio || mentor.philosophy || mentor.mindset || mentor.era) && (
            <div className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mentor.bio && (
                  <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-primary">Bio</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{mentor.bio}</p>
                    </CardContent>
                  </Card>
                )}
                {mentor.philosophy && (
                  <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold text-blue-600">Philosophy</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{mentor.philosophy}</p>
                    </CardContent>
                  </Card>
                )}
                {mentor.mindset && (
                  <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <FolderOpen className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm font-semibold text-green-600">Mindset</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{mentor.mindset}</p>
                    </CardContent>
                  </Card>
                )}
                {mentor.era && (
                  <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-semibold text-purple-600">Era</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{mentor.era}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6 lg:py-10">
        <Tabs defaultValue="quotes" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="quotes" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Quotes ({mentor.quotes.length})
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Sources ({mentor.sources.length})
            </TabsTrigger>
          </TabsList>

          {/* Quotes Tab */}
          <TabsContent value="quotes" className="space-y-6">
            {mentor.quotes.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No quotes yet</h3>
                  <p className="text-muted-foreground">This mentor's quotes will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentor.quotes.map((quote) => (
                  <Card key={quote.id} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <blockquote className="text-lg leading-relaxed mb-3">
                            {quote.quote}
                          </blockquote>
                          {quote.meaning && (
                            <p className="text-sm text-muted-foreground italic">
                              {quote.meaning}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {mentor.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{mentor.name}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Sources Tab */}
          <TabsContent value="sources" className="space-y-6">
            {mentor.sources.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No sources yet</h3>
                  <p className="text-muted-foreground">This mentor's books and videos will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentor.sources.map((source) => (
                  <Card
                    key={source.id}
                    className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                    onClick={() => navigate(`/source/${source.id}`)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${source.sourceType === 'video'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                          }`}>
                          {source.sourceType === 'video' ? (
                            <Play className="h-6 w-6" />
                          ) : (
                            <FileText className="h-6 w-6" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge
                            variant={source.sourceType === 'video' ? 'destructive' : 'default'}
                            className="text-xs mb-1"
                          >
                            {source.sourceType}
                          </Badge>
                          <h3 className="font-semibold text-sm leading-tight truncate">
                            {source.sourceTitle}
                          </h3>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {source.creator && (
                        <p className="text-sm text-muted-foreground mb-3">
                          by {source.creator}
                        </p>
                      )}

                      {source._count?.ideas && (
                        <div className="flex items-center justify-between pt-3 border-t">
                          <span className="text-xs text-muted-foreground">
                            {source._count.ideas} ideas extracted
                          </span>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            View →
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
