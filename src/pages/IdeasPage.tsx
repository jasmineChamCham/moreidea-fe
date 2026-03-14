import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Plus, Trash2, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ideasApi, Idea } from "@/lib/ideas.api";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [open, setOpen] = useState(false);
  const [person, setPerson] = useState("");
  const [quote, setQuote] = useState("");
  const [place, setPlace] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const fetchIdeas = async () => {
    try {
      const data = await ideasApi.getAll();
      setIdeas(data);
    } catch (err) {
      console.error("Failed to fetch ideas", err);
    }
  };

  useEffect(() => { fetchIdeas(); }, []);

  const handleAdd = async () => {
    if (!person.trim() || !quote.trim()) return;
    try {
      await ideasApi.create({
        person: person.trim(),
        quote: quote.trim(),
        place: place.trim() || undefined,
        photoUrl: photoUrl.trim() || undefined,
      });
      setPerson(""); setQuote(""); setPlace(""); setPhotoUrl("");
      setOpen(false);
      fetchIdeas();
    } catch (err) {
      console.error("Failed to create idea", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await ideasApi.delete(id);
      fetchIdeas();
    } catch (err) {
      console.error("Failed to delete idea", err);
    }
  };

  return (
    <div className="container py-6 lg:py-10 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          Ideas
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="font-display">
              <Plus className="h-4 w-4" />
              Add Idea
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Add Idea</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Person *</label>
                <Input placeholder="e.g. Jay Shetty" value={person} onChange={(e) => setPerson(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Quote *</label>
                <Textarea placeholder="The quote that inspired you..." value={quote} onChange={(e) => setQuote(e.target.value)} className="resize-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Place (YouTube, Book, Instagram...)</label>
                <Input placeholder="e.g. YouTube video link, Book name..." value={place} onChange={(e) => setPlace(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Photo URL (optional)</label>
                <Input placeholder="Paste image URL..." value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
              </div>
              <Button onClick={handleAdd} className="w-full font-display" disabled={!person.trim() || !quote.trim()}>
                Save Idea
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {ideas.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No ideas yet. Click "Add Idea" to save your first one.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.map((idea) => (
          <Card key={idea.id} className="group">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base font-display">{idea.person}</CardTitle>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" onClick={() => handleDelete(idea.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm italic text-secondary-foreground border-l-2 border-primary/30 pl-3">"{idea.quote}"</p>
              {idea.place && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  {idea.place}
                </p>
              )}
              {idea.photoUrl && (
                <img src={idea.photoUrl} alt="Reference" className="rounded-md mt-2 max-h-40 object-cover w-full" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
