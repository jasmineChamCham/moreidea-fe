import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, BookOpen, Palette, Loader2, Video, Brain, Mic, Zap, Clock } from "lucide-react";
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
        {/* Sidebar - Mentor Profile */}
        <div className="space-y-4">
          <div
            className="overflow-hidden"
            style={{
              borderRadius: "1rem",
              border: "1px solid hsl(225 12% 18%)",
              backgroundColor: "hsl(225 13% 8%)",
              boxShadow: "0 8px 32px hsl(260 45% 20% / 0.1), 0 2px 8px hsl(0 0% 0% / 0.4)",
            }}
          >
            {/* 1. Cover banner */}
            <div
              style={{
                height: "140px",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 1.5rem",
                textAlign: "center",
                position: "relative",
              }}
            >
              <p style={{ fontSize: "1.25rem", fontWeight: "600", color: "hsl(225 13% 8%)" }}>
                The quickest way to become more confident is to become more competent.
              </p>
            </div>

            {/* 2. Avatar + Identity Section */}
            <div style={{ padding: "0 1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "-48px", marginBottom: "0.75rem" }}>
                <div style={{ position: "relative" }}>
                  {mentor.avatarUrl ? (
                    <img
                      src={mentor.avatarUrl}
                      alt={mentor.name}
                      className="rounded-full object-cover block"
                      style={{
                        width: "96px", height: "96px",
                        border: "4px solid hsl(225 13% 8%)",
                        backgroundColor: "hsl(225 13% 8%)"
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: "96px", height: "96px",
                        background: "linear-gradient(135deg, hsl(260 45% 45%), hsl(195 50% 42%))",
                        border: "4px solid hsl(225 13% 8%)",
                      }}
                    >
                      <span className="text-4xl font-bold text-white tracking-tight">{mentor.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                {/* Optional Follow/Badge on right side */}
                <div className="mb-2">
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-foreground border border-border">
                    {mentor.archetype || "Mentor"}
                  </span>
                </div>
              </div>

              {/* Name & Handle */}
              <div style={{ marginBottom: "1rem" }}>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-bold text-xl text-foreground tracking-tight" style={{ lineHeight: 1.1 }}>
                    {mentor.name}
                  </h3>
                  <div className="text-blue-400 bg-blue-400/10 p-0.5 rounded-full" title="Verified Mentor">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>

                {mentor.archetype && (
                  <p className="text-muted-foreground text-sm mt-1">
                    @{mentor.archetype.toLowerCase().replace(/[^a-z0-g]/g, "")}
                  </p>
                )}
              </div>

              {/* 3. Bio Section */}
              {mentor.bio && (
                <p className="text-sm text-foreground/85 leading-relaxed mb-5 line-clamp-3">
                  {mentor.bio}
                </p>
              )}

              {/* 4. Profile Stats Row */}
              <div className="flex gap-6 mb-5">
                <div className="flex flex-col">
                  <span className="text-foreground font-semibold text-sm">
                    Field
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {mentor.style ? mentor.style.split(',')[0].trim() : "General"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-foreground font-semibold text-sm">
                    Type
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {mentor.archetype || ""}
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Divider */}
            <div className="h-px bg-border/60 w-full mb-4" />

            {/* 6. Profile Details Section */}
            <div style={{ padding: "0 1.5rem 1.5rem" }}>
              <div className="space-y-4">
                {([
                  { label: "Philosophy", value: mentor.philosophy, icon: Brain },
                  { label: "Mindset", value: mentor.mindset, icon: Sparkles },
                  { label: "Speaking Style", value: mentor.speakingStyle, icon: Mic },
                  { label: "Body Language", value: mentor.bodyLanguage, icon: Zap },
                  { label: "Tags", value: mentor.style?.split(',').map(s => s.trim()).join(' · '), icon: Palette },
                ] as const).filter(item => item.value).map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="mt-0.5 mt-1 text-muted-foreground">
                      <item.icon className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground tracking-tight leading-none mb-1">{item.label}</p>
                      <p className="text-[0.85rem] text-muted-foreground leading-relaxed">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
