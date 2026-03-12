import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, BookOpen, Palette, Loader2, Video } from "lucide-react";
import { mentorsApi, Mentor } from "@/lib/mentors.api";

export default function IdeaPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState<{ hook: string; body: string; bridge: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const data = await mentorsApi.getAll();
        if (data && data.length > 0) {
          setMentors(data);
          setSelectedMentorId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch mentors", err);
      }
    };
    fetchMentors();
  }, []);

  const mentor = mentors.find((m) => m.id === selectedMentorId);

  const handleGenerate = async () => {
    const apiKey = localStorage.getItem("moreidea_gemini_key");
    if (!apiKey) {
      alert("Please add your Gemini API key in Settings first.");
      return;
    }
    if (!topic.trim() || !mentor) return;

    setIsGenerating(true);
    setScript(null);

    try {
      const prompt = `You are a world-class YouTube scriptwriter channeling the voice of ${mentor.name}. Style: ${mentor.style}.

Write a deep, philosophical YouTube script about: "${topic}"

Return ONLY valid JSON with this structure:
{"hook":"(30-sec attention-grabbing opening)","body":"(2-3 min deep dive using ${mentor.name}'s frameworks, with specific examples and metaphors)","bridge":"(30-sec call-to-action that connects to viewer's life)"}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setScript(JSON.parse(jsonMatch[0]));
      } else {
        setScript({ hook: "Could not parse response.", body: text, bridge: "" });
      }
    } catch (e) {
      console.error(e);
      setScript({ hook: "Error generating script.", body: "Please check your API key and try again.", bridge: "" });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!mentor) return <div className="p-6 text-muted-foreground">Loading mentors...</div>;

  return (
    <div className="container py-6 lg:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mentor Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Mentor Voice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mentors.map((m) => (
                  <Button
                    key={m.id}
                    variant={selectedMentorId === m.id ? "mentorActive" : "mentor"}
                    size="sm"
                    onClick={() => setSelectedMentorId(m.id)}
                  >
                    {m.name}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">{mentor.style}</p>
            </CardContent>
          </Card>

          {/* Topic Input */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                Core Idea
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder='e.g. "Self-worth for developers" or "Why loneliness is a superpower"'
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className="w-full font-display"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Channeling {mentor.name}...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Script
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Script */}
          {script && (
            <div className="space-y-4 animate-fade-in">
              {[
                { label: "Hook", content: script.hook, icon: "🎣" },
                { label: "Body", content: script.body, icon: "📖" },
                { label: "Bridge", content: script.bridge, icon: "🌉" },
              ].map((section) => (
                <Card key={section.label} className="glow-primary">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-display flex items-center gap-2">
                      <span>{section.icon}</span>
                      {section.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Mentor Profile */}
        <div className="space-y-6">
          <Card className="glow-accent">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                Mentor Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Archetype", value: mentor.archetype, icon: Sparkles },
                { label: "Philosophy", value: mentor.philosophy, icon: Sparkles },
                { label: "Mindset", value: mentor.mindset, icon: BookOpen },
                { label: "Speaking Style", value: mentor.speakingStyle, icon: Video },
                { label: "Body Language", value: mentor.bodyLanguage, icon: Palette },
                { label: "Era", value: mentor.era, icon: BookOpen },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.label}</span>
                  </div>
                  <p className="text-sm text-secondary-foreground">{item.value || "—"}</p>
                </div>
              ))}
              {mentor.bio && (
                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Bio</p>
                  <p className="text-sm text-secondary-foreground line-clamp-4">{mentor.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
