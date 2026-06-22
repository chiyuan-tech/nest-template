'use client';

import { Check, Copy, Facebook, Linkedin, Share2 } from 'lucide-react';
import { useState } from 'react';

interface BlogShareRailProps {
  title: string;
  url: string;
}

export default function BlogShareRail({ title, url }: BlogShareRailProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: 'Share on Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Facebook,
    },
    {
      label: 'Share on X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      text: 'X',
    },
    {
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      icon: Linkedin,
    },
  ];

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="sticky top-28 flex h-fit flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleShare}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 bg-background text-foreground shadow-sm transition-colors hover:bg-foreground hover:text-background"
        aria-label="Share this article"
        title="Share this article"
      >
        <Share2 className="h-4 w-4" />
      </button>

      {shareLinks.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 bg-background text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-foreground hover:text-background"
            aria-label={item.label}
            title={item.label}
          >
            {Icon ? <Icon className="h-4 w-4" /> : item.text}
          </a>
        );
      })}

      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        }}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 bg-background text-foreground shadow-sm transition-colors hover:bg-foreground hover:text-background"
        aria-label="Copy article link"
        title={copied ? 'Copied' : 'Copy article link'}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
