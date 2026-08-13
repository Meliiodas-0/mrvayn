"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { cn } from "@/lib/cn";

export interface CursorCardProps {
  children: React.ReactNode;
  image: string;
  description: string;
  href?: string;
  className?: string;
}

export function CursorCard({ children, image, description, href = "#", className }: CursorCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const toX = React.useRef<((v: number) => void) | null>(null);
  const toY = React.useRef<((v: number) => void) | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isHovered || !cardRef.current) return;
    toX.current = gsap.quickTo(cardRef.current, "x", { duration: 0.35, ease: "power3.out" });
    toY.current = gsap.quickTo(cardRef.current, "y", { duration: 0.35, ease: "power3.out" });
    gsap.fromTo(cardRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.15, ease: "power2.out" });
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (toX.current && toY.current) { toX.current(e.clientX - 120); toY.current(e.clientY + 20); }
    else if (cardRef.current) gsap.set(cardRef.current, { x: e.clientX - 120, y: e.clientY + 20 });
  };

  return (
    <>
      <a
        href={href}
        className={cn(
          "relative inline-block font-bold text-neutral-900 dark:text-neutral-100 transition-colors",
          "hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded px-1 -mx-1",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {children}
      </a>

      {mounted && typeof document !== "undefined" && createPortal(
        <>
          {isHovered && (
            <div
              ref={cardRef}
              className={cn(
                "fixed top-0 left-0 pointer-events-none z-50 w-[240px]",
                "bg-white dark:bg-neutral-900 p-3 shadow-2xl rounded-xl border border-neutral-200 dark:border-neutral-800"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="hover preview" className="w-full h-auto rounded-md mb-3 object-cover" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400 m-0 leading-relaxed">
                {description}
              </p>
            </div>
          )}
        </>,
        document.body
      )}
    </>
  );
}

export default CursorCard;
