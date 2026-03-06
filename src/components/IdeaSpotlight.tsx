"use client";

import { useState } from "react";
import { Check, Copy, RotateCcw, FileText, MessageSquare, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface IdeaSpotlightProps {
  content: string;
  onClose?: () => void;
  onReset?: () => void;
}

export default function IdeaSpotlight({ content, onClose, onReset }: IdeaSpotlightProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"verdict" | "transcript">("verdict");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center justify-between px-6 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-0">
          <button
            onClick={() => setActiveTab("verdict")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "verdict"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-zinc-600 hover:text-zinc-400"
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${activeTab === "verdict" ? "bg-emerald-500" : "bg-zinc-700"}`} />
            The Final Verdict
          </button>
          <button
            onClick={() => setActiveTab("transcript")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "transcript"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-zinc-600 hover:text-zinc-400"
            }`}
          >
            <FileText className="w-3 h-3" />
            Full Transcript
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Refine Query
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy to Clipboard"}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {activeTab === "verdict" ? (
          <article className="prose prose-invert prose-sm max-w-3xl mx-auto
            prose-headings:font-semibold prose-headings:text-zinc-100 prose-headings:tracking-tight
            prose-p:text-zinc-400 prose-p:leading-relaxed
            prose-strong:text-zinc-200
            prose-li:text-zinc-400
            prose-code:text-blue-300 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
            prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-lg
            prose-blockquote:border-blue-500/30 prose-blockquote:text-zinc-500
            prose-hr:border-zinc-800
          ">
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>
        ) : (
          <div className="font-mono text-xs text-zinc-500 leading-relaxed max-w-3xl mx-auto whitespace-pre-wrap">
            {content}
          </div>
        )}
      </div>
    </div>
  );
}
