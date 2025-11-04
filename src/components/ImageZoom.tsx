"use client";
import { useRef, useState } from "react";

type SrcSet = {
  desktop: string;
  tablet: string;
  mobile: string;
};

export default function ImageZoom({
  src,
  alt,
  className,
  priority = false,
  maxZoom = 2,
}: {
  src: SrcSet;
  alt: string;
  className?: string;
  priority?: boolean;
  maxZoom?: number;
}) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const updateOrigin = (clientX: number, clientY: number) => {
    const c = containerRef.current;
    const i = imgRef.current;
    if (!c || !i) return;
    const rect = c.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    i.style.transformOrigin = `${x}% ${y}%`;
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!zoomed) return;
    updateOrigin(e.clientX, e.clientY);
  };

  const onPointerEnter: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!zoomed) return;
    updateOrigin(e.clientX, e.clientY);
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!zoomed) return;
    const t = e.touches[0];
    updateOrigin(t.clientX, t.clientY);
  };

  const toggleZoom = () => setZoomed((z) => !z);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleZoom();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className ?? ""}`}
      role="group"
      aria-label={alt}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onTouchMove={onTouchMove}
    >
      <picture className="block w-full h-full">
        <source media="(min-width: 1024px)" srcSet={src.desktop} />
        <source media="(min-width: 640px)" srcSet={src.tablet} />
        <img
          ref={imgRef}
          src={src.mobile}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-200 ease-out cursor-zoom-in"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "low"}
          style={{ transform: zoomed ? `scale(${maxZoom})` : "scale(1)" }}
          onClick={toggleZoom}
          aria-pressed={zoomed}
        />
      </picture>

      <div className="absolute bottom-2 right-2 z-10">
        <button
          type="button"
          className="px-3 py-1 text-xs rounded bg-neutral-900/80 text-white backdrop-blur hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
          onClick={toggleZoom}
          aria-label={zoomed ? "Zoom out" : "Zoom in"}
        >
          {zoomed ? "Zoom out" : "Zoom in"}
        </button>
      </div>
    </div>
  );
}