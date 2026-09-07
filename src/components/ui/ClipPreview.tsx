"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { projectUi } from "@/data/projects";

/** On-demand media shared by the selected cards and case studies. No MP4 request
 * before a visitor presses Play. Only one preview can play at a time. */
export function ClipPreview({ src, poster, title, label = projectUi.playPreview, posterAlt, describedBy }: {
  src: string;
  poster?: string;
  title: string;
  label?: string;
  posterAlt?: string;
  describedBy?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!playing || !videoRef.current) return;
    const video = videoRef.current;
    video.focus({ preventScroll: true });
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
    });
    observer.observe(video);
    const pause = () => video.pause();
    const pauseWhenHidden = () => { if (document.hidden) pause(); };
    const pauseForAnother = (event: Event) => {
      if ((event as CustomEvent).detail !== video) pause();
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    document.addEventListener("portfolio:preview-play", pauseForAnother);
    document.addEventListener("portfolio:pause-previews", pause);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      document.removeEventListener("portfolio:preview-play", pauseForAnother);
      document.removeEventListener("portfolio:pause-previews", pause);
    };
  }, [playing]);

  if (failed) {
    return <div role="status" className="grid aspect-video place-items-center bg-void p-8 text-center text-sm leading-relaxed text-mist">{projectUi.previewUnavailable}</div>;
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-void">
      {playing ? (
        // Existing previews contain no speech; adjacent captions describe the action.
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          aria-label={`${title} preview`}
          aria-describedby={describedBy}
          tabIndex={0}
          controls
          autoPlay
          muted
          playsInline
          preload="none"
          onPlay={(event) => document.dispatchEvent(new CustomEvent("portfolio:preview-play", { detail: event.currentTarget }))}
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <button onClick={() => setPlaying(true)} aria-label={`${label}: ${title}`} className="group relative block h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster} alt={posterAlt ?? `${title} preview`} width={1280} height={720} loading="lazy" className="h-full w-full object-contain" />
          <span className="absolute inset-0 grid place-items-center bg-black/15 transition-colors group-hover:bg-black/5">
            <span className="grid h-16 w-16 place-items-center rounded-full border border-white/60 bg-black/75 text-white shadow-xl transition-transform group-hover:scale-105 motion-reduce:transform-none">
              <Play aria-hidden className="ml-1 h-6 w-6 fill-current" />
            </span>
          </span>
          <span className="absolute bottom-3 right-3 rounded border border-white/20 bg-black/85 px-3 py-2 font-mono text-[10px] uppercase text-white sm:bottom-4 sm:right-4 sm:text-xs">{label}</span>
        </button>
      )}
    </div>
  );
}
