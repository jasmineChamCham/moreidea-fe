import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { anchorsApi, Anchor as AnchorType } from "@/lib/anchors.api";

interface Anchor {
  id: string;
  content: string;
  category: string;
}

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
              <div className="space-y-3">
                {relatedAnchors.map((anchor) => (
                  <Card key={anchor.id} className="p-4">
                    <p className="text-sm leading-relaxed">{anchor.content}</p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded">
                        {anchor.category}
                      </span>
                    </div>
                  </Card>
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
              <div className="space-y-3">
                {anchors.map((anchor) => (
                  <Card key={anchor.id} className="p-4">
                    <p className="text-sm leading-relaxed">{anchor.content}</p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded">
                        {anchor.category}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
