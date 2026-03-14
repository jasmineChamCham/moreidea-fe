import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Video, Plus, Loader2, Upload } from "lucide-react";
import { sourcesApi } from "@/lib/sources.api";
import { mentorsApi, Mentor } from "@/lib/mentors.api";
import { toast } from "sonner";

interface NewSourceDialogProps {
  onSourceCreated: (sourceId: string) => void;
}

export default function NewSourceDialog({ onSourceCreated }: NewSourceDialogProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"book" | "video">("video");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentorId, setSelectedMentorId] = useState("");

  // Book state
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Video state
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoSubtitles, setVideoSubtitles] = useState("");

  const fetchMentors = async () => {
    try {
      const data = await mentorsApi.getAll();
      setMentors(data);
    } catch (err) {
      console.error("Failed to fetch mentors", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMentors();
    }
  }, [open]);

  const selectedMentor = mentors.find(m => m.id === selectedMentorId);

  const handleBookSubmit = async () => {
    if (!pdfFile) return;
    setIsProcessing(true);

    try {
      const source = await sourcesApi.createBookSource(pdfFile);
      toast.success(`Extracted ${source._count?.ideas || 0} ideas from "${source.sourceTitle}"`);
      setPdfFile(null);
      setOpen(false);
      onSourceCreated(source.id);
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to process book");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVideoSubmit = async () => {
    if (!videoTitle.trim()) return;
    setIsProcessing(true);

    try {
      const videoData = {
        title: videoTitle.trim(),
        url: videoUrl.trim() || undefined,
        description: videoDescription.trim() || undefined,
        subtitles: videoSubtitles.trim() || undefined
      };

      const source = await sourcesApi.createVideoSource(videoData);
      toast.success(`Extracted ${source._count?.ideas || 0} ideas from "${source.sourceTitle}"`);
      setVideoUrl("");
      setVideoTitle("");
      setVideoDescription("");
      setVideoSubtitles("");
      setOpen(false);
      onSourceCreated(source.id);
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to process video");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-display">
          <Plus className="h-4 w-4" /> New Source
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Add New Source</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Mentor *
            </label>
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
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as "book" | "video")} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" /> Video (Link)
            </TabsTrigger>
            <TabsTrigger value="book" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Book (PDF)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="book" className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Upload PDF *
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/30">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {pdfFile ? pdfFile.name : "Click to upload PDF"}
                  </p>
                  {pdfFile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {(pdfFile.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            <Button
              onClick={handleBookSubmit}
              className="w-full font-display"
              disabled={!pdfFile || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing Book...
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4" /> Extract Ideas
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="video" className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Video Title *
              </label>
              <Input
                placeholder="Enter video title..."
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Video URL (Optional)
              </label>
              <Input
                placeholder="Paste YouTube, Facebook, or Instagram link..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Supports YouTube, Facebook Reels, Instagram Reels, Shorts, etc.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Description (Optional)
              </label>
              <Input
                placeholder="Enter video description..."
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Video Subtitles/Transcript (Optional)
              </label>
              <Textarea
                placeholder="Paste video subtitles or transcript here..."
                value={videoSubtitles}
                onChange={(e) => setVideoSubtitles(e.target.value)}
                rows={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste the full transcript or subtitles of the video for better idea extraction
              </p>
            </div>

            <Button
              onClick={handleVideoSubmit}
              className="w-full font-display"
              disabled={!videoTitle.trim() || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing Video...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4" /> Extract Ideas
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
