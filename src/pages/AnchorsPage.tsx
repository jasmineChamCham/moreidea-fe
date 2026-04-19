import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, RefreshCw, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { anchorsApi, Anchor } from "@/lib/anchors.api";

const getCategoryColor = (category: string) => {
  const norm = category?.toLowerCase() || '';
  if (norm.includes('tech') || norm.includes('code') || norm.includes('software')) return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50';
  if (norm.includes('health') || norm.includes('fit') || norm.includes('mental')) return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/50';
  if (norm.includes('busin') || norm.includes('finan') || norm.includes('startup')) return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/50';
  if (norm.includes('design') || norm.includes('art') || norm.includes('creativ')) return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-900/20 dark:text-fuchsia-300 dark:border-fuchsia-800/50';
  if (norm.includes('scienc') || norm.includes('edu') || norm.includes('learn')) return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800/50';
  return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/50';
};

export default function AnchorsPage() {
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [searchText, setSearchText] = useState("");
  const [relatedAnchors, setRelatedAnchors] = useState<Anchor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRelated, setShowRelated] = useState(false);

  useEffect(() => {
    // Fetch all anchors on component mount
    const fetchAnchors = async () => {
      try {
        const data = await anchorsApi.getAll();
        setAnchors(data);
      } catch (error) {
        console.error("Failed to fetch anchors:", error);
      }
    };

    fetchAnchors();
  }, []);

  const handleSearchRelated = async () => {
    if (!searchText.trim()) return;

    setIsLoading(true);
    try {
      const data = await anchorsApi.searchRelated(searchText);
      setRelatedAnchors(data);
      setShowRelated(true);
    } catch (error) {
      console.error("Failed to search related anchors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
    setShowRelated(false);
    setRelatedAnchors([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Anchors</h1>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Related Anchors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter text to find 100 related anchors..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSearchRelated()}
            />
            <Button
              onClick={handleSearchRelated}
              disabled={!searchText.trim() || isLoading}
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </Button>
            {showRelated && (
              <Button variant="outline" onClick={handleClearSearch}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {showRelated ? (
        <Card>
          <CardHeader>
            <CardTitle>Related Anchors ({relatedAnchors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4 pr-4">
                {relatedAnchors.map((anchor) => (
                  <div key={anchor.id} className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 font-medium text-xs rounded-full border ${getCategoryColor(anchor.category)}`}>
                        {anchor.category}
                      </span>
                      {anchor.relevanceScore !== undefined && (
                         <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 text-primary text-xs font-semibold rounded-full ring-1 ring-primary/20">
                           <Sparkles className="w-3.5 h-3.5" />
                           {(anchor.relevanceScore * 100).toFixed(1)}% Match
                         </div>
                      )}
                    </div>
                    <p className="text-[1.05rem] text-foreground/90 leading-loose tracking-wide break-words font-medium">
                      {anchor.content}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Anchors ({anchors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4 pr-4">
                {anchors.map((anchor) => (
                  <div key={anchor.id} className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 font-medium text-xs rounded-full border ${getCategoryColor(anchor.category)}`}>
                        {anchor.category}
                      </span>
                    </div>
                    <p className="text-[1.05rem] text-foreground/90 leading-loose tracking-wide break-words font-medium">
                      {anchor.content}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
