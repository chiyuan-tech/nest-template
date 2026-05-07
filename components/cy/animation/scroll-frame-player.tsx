'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const TOTAL_FRAMES = 96;

export function ScrollFramePlayer() {
  const frames = useMemo(
    () =>
      Array.from({ length: TOTAL_FRAMES }, (_, index) => {
        const frameNumber = String(index).padStart(2, '0');
        return `/ezgif-split/frame_${frameNumber}_delay-0.083s.webp`;
      }),
    [],
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const preloadedFramesRef = useRef<HTMLImageElement[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;

    const preloaded = frames.map((frameSrc) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = frameSrc;
      const onFrameSettled = () => {
        loadedCount += 1;
        if (!isCancelled && loadedCount === frames.length) {
          preloadedFramesRef.current = preloaded;
          setIsReady(true);
        }
      };
      image.onload = onFrameSettled;
      image.onerror = onFrameSettled;
      return image;
    });

    return () => {
      isCancelled = true;
    };
  }, [frames]);

  useEffect(() => {
    if (!isReady) return;

    let rafId = 0;

    const drawFrame = (frameIndex: number) => {
      const canvas = canvasRef.current;
      const frame = preloadedFramesRef.current[frameIndex];

      if (!canvas || !frame) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      if (canvas.width !== frame.naturalWidth || canvas.height !== frame.naturalHeight) {
        canvas.width = frame.naturalWidth;
        canvas.height = frame.naturalHeight;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(frame, 0, 0, canvas.width, canvas.height);
    };

    const updateFrameFromScroll = () => {
      const targetContainer = canvasRef.current?.closest<HTMLElement>('[data-scroll-frame-end]');
      if (!targetContainer) {
        drawFrame(0);
        return;
      }

      const fixedHeader = document.querySelector<HTMLElement>('header.fixed');
      const navHeight = fixedHeader?.getBoundingClientRect().height ?? 0;
      const targetTop = targetContainer.getBoundingClientRect().top + window.scrollY;
      const startScroll = 0;
      const endScroll = Math.max(startScroll + 1, targetTop - navHeight);
      const progress = Math.min(1, Math.max(0, (window.scrollY - startScroll) / (endScroll - startScroll)));
      const nextFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * (TOTAL_FRAMES - 1)));
      drawFrame(nextFrame);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateFrameFromScroll);
    };

    updateFrameFromScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isReady]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 w-full h-full overflow-hidden rounded-xl bg-black/20 shadow-2xl backdrop-blur-sm">
      <canvas
        ref={canvasRef}
        aria-label="Scroll-driven sequence animation"
        className="h-full w-full select-none object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
    </div>
  );
}
