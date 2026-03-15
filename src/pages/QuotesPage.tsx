import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Plus, Trash2, ExternalLink, Edit, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { quotesApi, Quote } from "@/lib/quotes.api";
import { mentorsApi, Mentor } from "@/lib/mentors.api";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState("");
  const [quote, setQuote] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const fetchQuotes = async () => {
    try {
      const data = await quotesApi.getAll();
      setQuotes(data);
    } catch (err) {
      console.error("Failed to fetch quotes", err);
    }
  };

  const fetchMentors = async () => {
    try {
      const data = await mentorsApi.getAll();
      setMentors(data);
    } catch (err) {
      console.error("Failed to fetch mentors", err);
    }
  };

  useEffect(() => {
    fetchQuotes();
    fetchMentors();
  }, []);

  const selectedMentor = mentors.find(m => m.id === selectedMentorId);

  const handleAdd = async () => {
    if (!selectedMentorId || !quote.trim()) return;
    try {
      await quotesApi.create({
        mentorId: selectedMentorId,
        quote: quote.trim(),
        photoUrl: photoUrl.trim() || undefined,
      });
      setSelectedMentorId(""); setQuote(""); setPhotoUrl("");
      setOpen(false);
      fetchQuotes();
    } catch (err) {
      console.error("Failed to create quote", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await quotesApi.delete(id);
      fetchQuotes();
    } catch (err) {
      console.error("Failed to delete quote", err);
    }
  };

  const handleEdit = (quote: Quote) => {
    setEditingQuote(quote);
    setSelectedMentorId(quote.mentorId);
    setQuote(quote.quote);
    setPhotoUrl(quote.photoUrl || "");
    setOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingQuote || !quote.trim()) return;
    try {
      await quotesApi.update(editingQuote.id, {
        quote: quote.trim(),
        photoUrl: photoUrl.trim() || undefined,
      });
      setEditingQuote(null);
      setSelectedMentorId(""); setQuote(""); setPhotoUrl("");
      setOpen(false);
      fetchQuotes();
    } catch (err) {
      console.error("Failed to update quote", err);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingQuote(null);
      setSelectedMentorId("");
      setQuote("");
      setPhotoUrl("");
    }
    setOpen(open);
  };

  const handleGenerateQuote = async () => {
    if (!photoUrl.trim()) return;

    setIsGeneratingQuote(true);
    try {
      const result = await quotesApi.generateFromImage(photoUrl.trim());
      if (result.quote && result.quote !== "No quote found in this image") {
        setQuote(result.quote);
      } else {
        alert("No quote found in this image. Please try another image.");
      }
    } catch (err) {
      console.error("Failed to generate quote from image", err);
      alert("Failed to generate quote from image. Please check the URL and try again.");
    } finally {
      setIsGeneratingQuote(false);
    }
  };

  return (
    <div className="container py-6 lg:py-10 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          Quotes
        </h1>
        <Dialog open={open} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="font-display">
              <Plus className="h-4 w-4" />
              Add Quote
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingQuote ? "Edit Quote" : "Add Quote"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium text-white mb-1 block">Mentor *</label>
                <Select value={selectedMentorId} onValueChange={setSelectedMentorId} disabled={!!editingQuote}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a mentor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentors.map((mentor) => (
                      <SelectItem key={mentor.id} value={mentor.id}>
                        <div className="flex items-center gap-2">
                          {mentor.avatarUrl && (
                            <img
                              src={mentor.avatarUrl}
                              alt={mentor.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          )}
                          {mentor.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              </div>
              <div>
                <label className="text-sm font-medium text-white mb-1 block">Quote *</label>
                <Textarea placeholder="The quote that inspired you..." value={quote} onChange={(e) => setQuote(e.target.value)} className="resize-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-1 block">Photo URL (optional)</label>
                <div className="space-y-2">
                  <Input placeholder="Paste image URL..." value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
                  {photoUrl && (
                    <Button
                      onClick={handleGenerateQuote}
                      variant="outline"
                      size="sm"
                      disabled={isGeneratingQuote}
                      className="w-full"
                    >
                      {isGeneratingQuote ? "Generating..." : "Generate Quote from Image"}
                    </Button>
                  )}
                  {photoUrl && (
                    <div className="mt-2">
                      <img
                        src={photoUrl}
                        alt="Quote preview"
                        className="rounded-md max-h-40 object-cover w-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        onLoad={(e) => {
                          e.currentTarget.style.display = 'block';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={editingQuote ? handleUpdate : handleAdd}
                className="w-full font-display"
                disabled={!selectedMentorId || !quote.trim()}
              >
                {editingQuote ? "Update Quote" : "Save Quote"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {quotes.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No quotes yet. Click "Add Quote" to save your first one.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {quotes.map((quote) => (
          <Card
            key={quote.id}
            className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            onClick={() => setSelectedQuote(quote)}
          >
            <div className="aspect-square relative">
              {quote.photoUrl ? (
                <img
                  src={quote.photoUrl}
                  alt={quote.mentor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/seed/${quote.id}/400/400.jpg`;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <div className="text-center p-4">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-muted-foreground font-medium">{quote.mentor.name}</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 max-w-[80%]">
                    <p className="text-xs font-medium text-center line-clamp-2">{quote.quote}</p>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-3">
              <p className="text-sm font-medium truncate">{quote.mentor.name}</p>
              <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(quote);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(quote.id);
                  }}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quote Popup Dialog */}
      <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
        <DialogContent className="max-w-2xl">
          {selectedQuote && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">
                  {selectedQuote.mentor.name}
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedQuote(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogHeader>
              <div className="space-y-4">
                <blockquote className="text-lg italic text-secondary-foreground border-l-4 border-primary/30 pl-4 py-2">
                  "{selectedQuote.quote}"
                </blockquote>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
