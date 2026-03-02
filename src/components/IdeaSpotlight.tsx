import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy, Sparkles } from "lucide-react";
import { useState } from "react";

interface IdeaSpotlightProps {
  content: string;
}

export default function IdeaSpotlight({ content }: IdeaSpotlightProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!content) return null;

  return (
    <section className="mt-12 rounded-xl border border-neon-accent/30 bg-background/50 backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between p-4 border-b border-neon-accent/20 bg-neon-accent/5">
        <div className="flex items-center gap-2 text-neon-accent">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-mono font-bold tracking-widest text-sm">FINAL_PROPOSAL.MD</h2>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border border-foreground/10 hover:bg-foreground/5 hover:border-foreground/20 transition-all font-mono text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>COPY TO CLIPBOARD</span>
            </>
          )}
        </button>
      </div>
      
      <div className="p-6 sm:p-8 font-sans prose prose-invert max-w-none 
          prose-headings:font-mono prose-headings:text-foreground
          prose-h1:text-2xl prose-h1:border-b prose-h1:border-foreground/10 prose-h1:pb-2
          prose-h2:text-xl prose-h2:text-neon-primary
          prose-h3:text-lg prose-h3:text-neon-accent
          prose-a:text-neon-primary prose-a:no-underline hover:prose-a:underline
          prose-code:text-neon-secondary prose-code:bg-foreground/5 prose-code:px-1 prose-code:rounded
          prose-pre:bg-[#0a0a0f] prose-pre:border prose-pre:border-foreground/10">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </section>
  );
}
