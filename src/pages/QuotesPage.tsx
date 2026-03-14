import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Plus, Trash2, ExternalLink } from "lucide-react";
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="font-display">
              <Plus className="h-4 w-4" />
              Add Quote
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Add Quote</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium text-white mb-1 block">Mentor *</label>
                <Select value={selectedMentorId} onValueChange={setSelectedMentorId}>
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
              <Button onClick={handleAdd} className="w-full font-display" disabled={!selectedMentorId || !quote.trim()}>
                Save Quote
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quotes.map((quote) => (
          <Card key={quote.id} className="group">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base font-display">{quote.mentor.name}</CardTitle>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8" onClick={() => handleDelete(quote.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm italic text-secondary-foreground border-l-2 border-primary/30 pl-3">"{quote.quote}"</p>
              {quote.photoUrl && (
                <img src={quote.photoUrl} alt="Reference" className="rounded-md mt-2 max-h-40 object-cover w-full" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
