"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type ImageProps = { variant: "image"; src: string; alt: string; className?: string; imgClassName?: string; loading?: "eager" | "lazy" };
type VideoProps = { variant: "video"; src: string; poster: string; className?: string; videoClassName?: string; videoDecoration?: ReactNode };
type AudioProps = { variant: "audio"; src: string; title: string; className?: string };
export type CyInlineMediaProps = ImageProps | VideoProps | AudioProps;

/** Shared CY media: images lazy-load; videos autoplay only while visibly in view; audio preserves the captured source. */
export function CyInlineMedia(props: CyInlineMediaProps) {
  if (props.variant === "video") return <Video {...props} />;
  if (props.variant === "audio") return <Audio {...props} />;
  return <Image {...props} />;
}

function Image({ src, alt, className, imgClassName, loading = "lazy" }: ImageProps) {
  return <div className={cn("relative h-full w-full min-h-0", className)}><img src={src} alt={alt} loading={loading} decoding="async" referrerPolicy="no-referrer" className={cn("h-full w-full object-cover transition-transform duration-500 group-hover:scale-105", imgClassName)} /></div>;
}

function Video({ src, poster, className, videoClassName, videoDecoration }: VideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && entry.intersectionRatio >= 0.35) void video.play().catch(() => {});
      else video.pause();
    }, { threshold: [0, 0.35, 0.7] });
    observer.observe(video);
    return () => { observer.disconnect(); video.pause(); };
  }, []);
  return <div className={cn("relative h-full w-full min-h-0", className)}><video ref={ref} className={cn("relative z-0 h-full w-full object-cover", videoClassName)} src={src} poster={poster} muted playsInline loop preload="metadata" aria-label="Video preview" />{videoDecoration ? <div className="pointer-events-none absolute inset-0 z-[1]">{videoDecoration}</div> : null}</div>;
}

function Audio({ src, title, className }: AudioProps) {
  return <figure className={cn("w-full", className)}><figcaption className="mb-2 text-sm font-medium text-foreground">{title}</figcaption><audio className="w-full" controls preload="metadata" src={src}>Your browser does not support audio playback.</audio></figure>;
}
