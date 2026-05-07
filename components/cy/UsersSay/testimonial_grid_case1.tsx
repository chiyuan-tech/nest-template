"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import Image from "next/image";
import { Heart, MessageCircle, Link2, Info, Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { TestimonialGridCase1Data, TweetFeedbackItem } from "@/components/cy/UsersSay/types";
import { CyTestimonialTitleCase1 } from "@/components/cy/headerLayout/cy-testimonial-title";
export interface TestimonialGridCase1Props {
  data: TestimonialGridCase1Data;
}

const buildTweetUrls = (tweetId: string, handle: string) => {
  return {
    tweetUrl: `https://x.com/i/web/status/${tweetId}`,
    profileUrl: `https://x.com/${handle}`,
    followUrl: `https://x.com/intent/follow?screen_name=${handle}`,
    likeUrl: `https://x.com/intent/like?tweet_id=${tweetId}`,
    replyUrl: `https://x.com/intent/post?in_reply_to=${tweetId}`,
  };
};

const isVideoMedia = (src: string) => /\.(mp4|webm|ogg)$/i.test(src);

const getVideoMimeType = (src: string) => {
  const ext = src.split(".").pop()?.toLowerCase();
  if (ext === "webm") return "video/webm";
  if (ext === "ogg") return "video/ogg";
  return "video/mp4";
};

const normalizeMediaSrc = (src: string) => {
  const value = src.trim();
  if (!value) return "https://cysource.gptimage.tools/home/assets/create_5.png";
  if (/^(https?:|data:|blob:|\/)/i.test(value)) return value;
  return `/${value}`;
};

const TweetMediaTile = ({
  src,
  index,
  total,
}: {
  src: string;
  index: number;
  total: number;
}) => {
  const mediaIsVideo = isVideoMedia(src);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideoPlayback = async () => {
    if (!mediaIsVideo || !videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      return;
    }
    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const mediaBoxClass =
    total === 1
      ? "relative overflow-hidden rounded-sm bg-black aspect-video"
      : "relative overflow-hidden rounded-sm bg-black aspect-[6/9]";

  return (
    <div className={mediaBoxClass}>
      {mediaIsVideo ? (
        <>
          <video
            ref={videoRef}
            className="h-full w-full object-contain"
            playsInline
            controls
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          >
            <source src={src} type={getVideoMimeType(src)} />
          </video>
          {!isPlaying && (
            <button
              type="button"
              onClick={toggleVideoPlayback}
              className="cursor-pointer absolute inset-0 flex items-center justify-center"
              aria-label={`Play video ${index + 1}`}
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/95 text-3xl text-primary-foreground shadow-lg sm:h-14 sm:w-14 sm:text-2xl">
                ▶
              </span>
            </button>
          )}
        </>
      ) : (
        <Image
          src={src}
          alt={`Tweet media ${index + 1}`}
          width={920}
          height={520}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
};

const TweetFeedbackCard = ({ item }: { item: TweetFeedbackItem }) => {
  const { tweetUrl, profileUrl, followUrl, likeUrl, replyUrl } = buildTweetUrls(item.tweetId, item.handle);
  const [copied, setCopied] = useState(false);
  const copyResetTimerRef = useRef<number | null>(null);
  const contentParagraphs = Array.isArray(item.contentLines)
    ? item.contentLines
    : item.contentLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(tweetUrl);
      setCopied(true);
      if (copyResetTimerRef.current) {
        window.clearTimeout(copyResetTimerRef.current);
      }
      copyResetTimerRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 4000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="w-full rounded-[22px] border border-white/15 bg-[#0f0f0f] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.5)] xl:p-5">
      <div className="rounded-[18px]  bg-[#0a0a0a] p-5  hover:bg-white/5 ">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-1">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer h-12 w-12 overflow-hidden   p-1.5"
            >
              <Image
                src={item.avatarSrc}
                alt={item.accountName}
                width={40}
                height={40}
                className="h-full w-full object-cover rounded-[100px]"
              />
            </a>
            <div className="space-y-0.5">
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-base font-semibold leading-tight text-white hover:text-zinc-300 hover:underline sm:text-base"
              >
                {item.accountName} <span className="text-yellow-400">✦</span>
              </a>
              <p className="text-xs leading-tight text-slate-300 sm:text-xs">
                @{item.handle} ·{" "}
                <a
                  href={followUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer text-sm font-bold text-primary hover:text-zinc-300 hover:underline"
                >
                  Follow
                </a>
              </p>
            </div>
          </div>
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer text-4xl text-zinc-400 hover:text-white sm:text-3xl"
          >
            𝕏
          </a>
        </div>

        <div className="space-y-5 text-center text-md leading-[1.25] text-zinc-100 sm:text-md">
          {contentParagraphs.map((line, pi) => (
            <p key={`${item.tweetId}-p-${pi}`}>
              <a href={tweetUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer ">
                {line}
              </a>
            </p>
          ))}
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl ">
          <div className="relative">
            <div className={`grid gap-1  ${item.mediaSrc.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
              {item.mediaSrc.map((media, idx) => {
                const normalizedMedia = normalizeMediaSrc(media);
                return (
                  <TweetMediaTile
                    key={`${normalizedMedia}-${idx}`}
                    src={normalizedMedia}
                    index={idx}
                    total={item.mediaSrc.length}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-base text-zinc-400 sm:text-sm">
          <span>{item.timestamp}</span>
          <a
            href={"https://help.x.com/en/x-for-websites-ads-info-and-privacy"}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded-full p-1 hover:bg-white/10"
          >
            <Info className="h-5 w-5" />
          </a>
        </div>

        <div className="mt-4 h-px bg-white/15" />

        <div className="mt-4 flex flex-wrap items-center gap-6 text-zinc-300 sm:gap-4 sm:text-sm">
          <a
            href={likeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group cursor-pointer inline-flex items-center gap-1"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-300 transition-all duration-200 group-hover:bg-white/10 ">
              <Heart className="h-4 w-4 fill-current" />
            </span>
            <span className="decoration-zinc-500/70 font-bold transition-colors duration-200 group-hover:text-white group-hover:decoration-white hover:underline">
              {item.likesLabel}
            </span>
          </a>
          <a
            href={replyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group cursor-pointer inline-flex items-center gap-1"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-primary transition-all duration-200 group-hover:bg-primary/15">
              <MessageCircle className="h-4 w-4 fill-current" />
            </span>
            <span className="decoration-zinc-500/70 font-bold transition-colors duration-200 group-hover:text-white group-hover:decoration-white hover:underline">
              {item.repliesLabel}
            </span>
          </a>
          <button type="button" onClick={handleCopyLink} className="group cursor-pointer inline-flex items-center gap-1">
            {copied ? (
              <>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-4 w-4 stroke-[2.4]" />
                </span>
                <span className="font-bold text-primary underline decoration-primary underline-offset-2">Copied!</span>
              </>
            ) : (
              <>
                <span className="flex h-8 w-8 items-center justify-center rounded-full text-primary transition-all duration-200 group-hover:bg-primary/15">
                  <Link2 className="h-4 w-4 stroke-[2.25]" />
                </span>
                <span className="decoration-zinc-500/70 font-bold transition-colors duration-200 group-hover:text-white group-hover:decoration-white hover:underline">
                  Copy link
                </span>
              </>
            )}
          </button>
        </div>

        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer mt-5 block rounded-full border border-white/15 py-3 text-center text-[17px] font-semibold text-primary transition-colors hover:bg-white/10 sm:text-sm"
        >
          {item.footerReplyLabel}
        </a>
      </div>
    </div>
  );
};

const FINE_POINTER_DRAG_THRESHOLD_PX = 6;
const COARSE_POINTER_DRAG_THRESHOLD_PX = 12;

function isValidDragThreshold(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}

export function TestimonialGridCase1({ data }: TestimonialGridCase1Props) {
  const titleLayout = data.titleLayout ?? "headerVertical";
  const items = data.items ?? [];
  const columns = useMemo(
    () => [0, 1, 2].map((columnIndex) => items.filter((_, idx) => idx % 3 === columnIndex)),
    [items]
  );

  const [dragThresholdPx, setDragThresholdPx] = useState(() =>
    isValidDragThreshold(data.dragThresholdPx)
      ? data.dragThresholdPx
      : FINE_POINTER_DRAG_THRESHOLD_PX
  );

  useEffect(() => {
    if (isValidDragThreshold(data.dragThresholdPx)) {
      setDragThresholdPx(data.dragThresholdPx);
      return;
    }
    const mql = window.matchMedia("(pointer: coarse)");
    const apply = () =>
      setDragThresholdPx(mql.matches ? COARSE_POINTER_DRAG_THRESHOLD_PX : FINE_POINTER_DRAG_THRESHOLD_PX);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [data.dragThresholdPx]);

  const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, label, [role="button"]';
  const [dragOffsets, setDragOffsets] = useState<number[]>(() => [0, 0, 0]);
  const [draggingColumn, setDraggingColumn] = useState<number | null>(null);
  const dragStateRef = useRef<{ index: number | null; startY: number; startOffset: number; isDragging: boolean }>({
    index: null,
    startY: 0,
    startOffset: 0,
    isDragging: false,
  });

  const handlePointerDown = (columnIndex: number) => (e: ReactPointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest(INTERACTIVE_SELECTOR)) {
      return;
    }
    dragStateRef.current = {
      index: columnIndex,
      startY: e.clientY,
      startOffset: dragOffsets[columnIndex] ?? 0,
      isDragging: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (columnIndex: number) => (e: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (dragState.index !== columnIndex) return;
    const deltaY = e.clientY - dragState.startY;
    if (!dragState.isDragging && Math.abs(deltaY) < dragThresholdPx) {
      return;
    }
    if (!dragState.isDragging) {
      dragStateRef.current = {
        ...dragState,
        isDragging: true,
      };
      setDraggingColumn(columnIndex);
    }
    const nextOffset = dragState.startOffset + deltaY;
    setDragOffsets((prev) => {
      const next = [...prev];
      next[columnIndex] = nextOffset;
      return next;
    });
  };

  const handlePointerEnd = (columnIndex: number) => (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current.index !== columnIndex) return;
    dragStateRef.current = { index: null, startY: 0, startOffset: 0, isDragging: false };
    setDraggingColumn(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-gradient-to-b from-[#060606] via-[#0b0b0b] to-[#060606] py-16 sm:py-20 md:py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_55%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-4">
        <CyTestimonialTitleCase1
          layoutId={titleLayout}
          data={{
            decorIndex: data.decorIndex,
            kicker: data.kicker,
            sectionTitle: data.sectionTitle,
            subtitle: data.subtitle,
          }}
        />

        <FadeIn duration={800} delay={200}>
          <div className="relative">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-black to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-black to-transparent" />
            <div className="grid h-[860px] grid-cols-1 gap-5 overflow-hidden lg:grid-cols-3">
              {columns.map((columnItems, columnIndex) => (
                <div
                  key={columnIndex}
                  className={`tweet-column relative overflow-hidden select-none touch-none ${draggingColumn === columnIndex ? "is-dragging cursor-grabbing" : "cursor-grab"}`}
                  onPointerDown={handlePointerDown(columnIndex)}
                  onPointerMove={handlePointerMove(columnIndex)}
                  onPointerUp={handlePointerEnd(columnIndex)}
                  onPointerCancel={handlePointerEnd(columnIndex)}
                  onPointerLeave={handlePointerEnd(columnIndex)}
                >
                  <div
                    className="h-full"
                    style={{ transform: `translateY(${dragOffsets[columnIndex] ?? 0}px)` }}
                  >
                    <div
                      className={
                        columnIndex % 2 === 0
                          ? "tweet-marquee-up flex flex-col gap-5"
                          : "tweet-marquee-down flex flex-col gap-5"
                      }
                    >
                      {[...columnItems, ...columnItems].map((item, index) => (
                        <TweetFeedbackCard key={`${item.tweetId}-${index}`} item={item} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
      <style jsx global>{`
        @keyframes tweet-marquee-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes tweet-marquee-down {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }

        .tweet-marquee-up {
          animation: tweet-marquee-up 36s linear infinite;
          will-change: transform;
        }

        .tweet-marquee-down {
          animation: tweet-marquee-down 36s linear infinite;
          will-change: transform;
        }

        .tweet-column:hover .tweet-marquee-up,
        .tweet-column:hover .tweet-marquee-down {
          animation-play-state: paused;
        }

        .tweet-column.is-dragging a,
        .tweet-column.is-dragging button {
          pointer-events: none;
        }
      `}</style>
    </section>
  );
}
