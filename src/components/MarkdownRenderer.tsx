import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-body ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl md:text-3xl font-bold font-display text-white mt-8 mb-4 leading-tight tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl md:text-2xl font-semibold font-display text-white mt-6 mb-3 leading-snug flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></span>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-cyan-400 uppercase tracking-wider mt-5 mb-2 flex items-center gap-2">
              <span className="w-0.5 h-3 bg-cyan-400/60 rounded-full"></span>
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-slate-200 leading-relaxed mb-4 text-base md:text-[0.95rem] antialiased">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-white bg-gradient-to-r from-cyan-400/20 to-blue-400/20 px-1.5 py-0.5 rounded-md">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="text-cyan-300 not-italic font-medium">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="space-y-2 mb-4 pl-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 mb-4 pl-4 list-decimal marker:text-cyan-400 marker:font-semibold">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-200 leading-relaxed text-base md:text-[0.95rem] flex gap-3 items-start pl-2">
              <span className="text-cyan-400 mt-1 text-sm">▸</span>
              <span>{children}</span>
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-gradient-to-b from-cyan-500 to-blue-500 pl-5 py-3 my-5 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent rounded-r-lg text-slate-300 italic">
              {children}
            </blockquote>
          ),
          code: ({ inline, children }: { inline?: boolean; children: React.ReactNode }) =>
            inline ? (
              <code className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-cyan-500/30 text-cyan-300 px-2 py-1 rounded-md text-sm font-mono shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                {children}
              </code>
            ) : (
              <pre className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-cyan-500/20 rounded-xl p-5 my-5 overflow-x-auto shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
                <code className="text-cyan-300 text-sm font-mono leading-relaxed">{children}</code>
              </pre>
            ),
          hr: () => (
            <hr className="border-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent my-8" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
