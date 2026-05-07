"use client";

import { Volume2, VolumeX } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useRef, useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type CyInlineMediaImageProps = {
  variant: "image";
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: "eager" | "lazy";
};

type CyInlineMediaVideoProps = {
  variant: "video";
  src: string;
  poster: string;
  className?: string;
  videoClassName?: string;
  /** 叠在视频之上、静音按钮之下；请使用 `pointer-events-none` 的节点，避免挡住悬停与播放 */
  videoDecoration?: ReactNode;
};

export type CyInlineMediaProps = CyInlineMediaImageProps | CyInlineMediaVideoProps;

/**
 * 内联图片 / 视频：根节点 `h-full w-full min-h-0`，尺寸与裁切由外层父级（如 `aspect-video`）决定。
 * 视频：鼠标进入播放、离开暂停；悬停时右上角可切换静音/有声（默认静音）。
 * 若外层需渐变遮罩，请用 `videoDecoration` 传入，勿在组件外再叠一层会拦截指针的 `absolute` 层。
 */
export function CyInlineMedia(props: CyInlineMediaProps) {
  if (props.variant === "video") {
    return <CyInlineMediaVideo {...props} />;
  }
  return <CyInlineMediaImage {...props} />;
}

function CyInlineMediaImage({
  src,
  alt,
  className,
  imgClassName,
  loading = "lazy",
}: CyInlineMediaImageProps) {
  return (
    <div className={cn("relative h-full w-full min-h-0", className)}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        referrerPolicy="no-referrer"
        className={cn(
          "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
          imgClassName
        )}
      />
    </div>
  );
}

function CyInlineMediaVideo({
  src,
  poster,
  className,
  videoClassName,
  videoDecoration,
}: CyInlineMediaVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [hovering, setHovering] = useState(false);

  const handleEnter = useCallback(() => {
    setHovering(true);
    const el = videoRef.current;
    if (!el) return;
    void el.play().catch(() => {});
  }, []);

  const handleLeave = useCallback(() => {
    setHovering(false);
    const el = videoRef.current;
    if (!el) return;
    el.pause();
  }, []);

  const toggleMuted = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMuted((m) => !m);
  }, []);

  return (
    <div
      className={cn("relative h-full w-full min-h-0", className)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <video
        ref={videoRef}
        className={cn("relative z-0 h-full w-full object-cover", videoClassName)}
        src={src}
        poster={poster}
        muted={muted}
        playsInline
        loop
        preload="metadata"
        aria-label="Video preview"
      />
      {videoDecoration != null ? (
        <div className="pointer-events-none absolute inset-0 z-[1]">{videoDecoration}</div>
      ) : null}
      {hovering ? (
        <button
          type="button"
          onClick={toggleMuted}
          className="cursor-pointer absolute right-2 top-2 z-[2] flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-black/55 text-white shadow-md backdrop-blur-sm transition-colors hover:bg-black/70"
          aria-label={muted ? "开启声音" : "静音"}
        >
          {muted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
        </button>
      ) : null}
    </div>
  );
}
