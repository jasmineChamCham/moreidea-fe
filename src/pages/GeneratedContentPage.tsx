import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import {
  ArrowLeft,
  Sparkles,
  Activity,
  Mic,
  Star,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';

/* ─── Score ring ─────────────────────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  const color =
    score >= 90 ? '#06b6d4' : score >= 70 ? '#3b82f6' : '#8b5cf6';
  const glow =
    score >= 90 ? '0 0 32px rgba(6,182,212,0.6)' : score >= 70 ? '0 0 32px rgba(59,130,246,0.6)' : '0 0 32px rgba(139,92,246,0.6)';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse"></div>
        <span className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">
          Quality Score
        </span>
      </div>
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ filter: glow, transition: 'stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-display bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
            {score}
          </span>
          <span className="text-xs text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Collapsible sidebar card ───────────────────────────────── */
interface SideCardProps {
  icon: React.ReactNode;
  title: string;
  accentClass: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function SideCard({ icon, title, accentClass, children, defaultOpen = true }: SideCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.05] transition-all duration-200 group"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`flex items-center gap-2.5 text-sm font-semibold ${accentClass}`}>
          {icon}
          {title}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5">
          <div className="border-t border-white/[0.08] pt-4">
            <MarkdownRenderer content={children as string} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function GeneratedContentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const contentData = location.state?.contentData || null;

  if (!contentData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-2">
          <Zap className="w-6 h-6 text-slate-500" />
        </div>
        <h2 className="text-xl font-semibold text-slate-300">No content generated yet</h2>
        <p className="text-slate-500 text-sm">Go back and generate content from your ideas.</p>
        <Button
          variant="outline"
          className="mt-2 border-white/10 hover:bg-white/5"
          onClick={() => navigate('/collect-relevant-ideas')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ideas
        </Button>
      </div>
    );
  }

  const { title, platform, content, analysis, bodyLanguage, toneVoice, score } = contentData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* ── Ambient glow layer ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(6,182,212,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 110%, rgba(59,130,246,0.12) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 50% 50%, rgba(168,85,247,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between backdrop-blur-sm bg-white/[0.02] rounded-2xl px-4 md:px-6 py-3 md:py-4 border border-white/[0.05]">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-200 text-sm group px-3 py-2 rounded-lg hover:bg-white/[0.05]"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse"></div>
            <h1 className="text-lg md:text-xl font-semibold font-display tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Generated Content
            </h1>
            <Badge
              variant="outline"
              className="border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-300 text-xs tracking-wide uppercase px-3 py-1 font-medium shadow-[0_0_12px_rgba(6,182,212,0.2)]"
            >
              {platform}
            </Badge>
          </div>
        </div>

        {/* ── Title strip ── */}
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-r from-white/[0.03] to-white/[0.01] backdrop-blur-sm px-6 md:px-8 py-5 md:py-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Title
            </p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white leading-tight bg-gradient-to-r from-white via-white/95 to-white/90 bg-clip-text">
            {title}
          </h2>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* Left — main script + analysis */}
          <div className="space-y-6">
            {/* Script */}
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.08] bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
                <span className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">
                  Script
                </span>
              </div>
              <div className="px-6 py-6 max-h-[600px] overflow-y-auto overscroll-contain
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-gradient-to-b from-cyan-500/30 to-blue-500/30
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb:hover]:from-cyan-500/40 [&::-webkit-scrollbar-thumb:hover]:to-blue-500/40">
                <MarkdownRenderer content={content} />
              </div>
            </div>

            {/* Analysis */}
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.08] bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold tracking-[0.2em] text-indigo-300 uppercase">
                  Analysis
                </span>
              </div>
              <div className="px-6 py-6">
                <MarkdownRenderer content={analysis} />
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">

            {/* Score ring */}
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-sm px-6 py-6 flex justify-center shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
              <ScoreRing score={score} />
            </div>

            {/* Body Language */}
            <SideCard
              icon={<Star className="w-4 h-4" />}
              title="Body Language"
              accentClass="text-amber-400"
            >
              {bodyLanguage}
            </SideCard>

            {/* Tone of Voice */}
            <SideCard
              icon={<Mic className="w-4 h-4" />}
              title="Tone of Voice"
              accentClass="text-purple-400"
              defaultOpen={false}
            >
              {toneVoice}
            </SideCard>

            {/* Refine CTA */}
            <button
              onClick={() => alert('Refine functionality coming soon!')}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl
                bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600
                hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500
                text-white font-semibold text-sm tracking-wide
                shadow-[0_0_24px_rgba(6,182,212,0.4)]
                hover:shadow-[0_0_32px_rgba(6,182,212,0.6)] hover:scale-[1.02]
                transition-all duration-300 border border-white/[0.1]"
            >
              <Sparkles className="w-4 h-4" />
              Refine Result
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
