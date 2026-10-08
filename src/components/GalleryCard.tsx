"use client";

import { useState } from "react";
import Link from "next/link";
import type { GalleryItem } from "@/lib/gallery";
import { getItemImages } from "@/lib/gallery";

interface GalleryCardProps {
  item: GalleryItem;
  /** "square" for home teaser, "wide" for full gallery */
  aspect?: "square" | "wide";
}

export default function GalleryCard({ item, aspect = "wide" }: GalleryCardProps) {
  const images = getItemImages(item);
  const [index, setIndex] = useState(0);
  const aspectClass =
    aspect === "square" ? "aspect-square" : "aspect-[4/3]";

  const hasMultiple = images.length > 1;
  const current = images[index];

  function prev(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function next(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
  }

  function goTo(e: React.MouseEvent, i: number) {
    e.preventDefault();
    e.stopPropagation();
    setIndex(i);
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-all hover:border-[var(--accent)] hover:shadow-lg hover:shadow-violet-900/20">
      {/* Image / carousel */}
      <div
        className={`relative ${aspectClass} overflow-hidden bg-gradient-to-br from-violet-950/80 to-indigo-950/60`}
      >
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current}
            alt={`${item.title}${hasMultiple ? ` (${index + 1}/${images.length})` : ""}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-6xl opacity-40 transition-opacity group-hover:opacity-70">
              {item.emoji}
            </span>
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-[var(--accent-muted)]/90 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          {item.tag}
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          {item.orderType === "available" ? "Available" : "Made to order"}
        </span>

        {/* Carousel controls */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover:opacity-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover:opacity-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => goTo(e, i)}
                  aria-label={`Photo ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-snug text-[var(--foreground)]">
            {item.title}
          </h3>
          <span className="shrink-0 rounded-md bg-[var(--accent-muted)]/15 px-2 py-0.5 text-sm font-semibold text-[var(--accent)]">
            {item.priceHint}
          </span>
        </div>
        <p className="mt-2 flex-1 text-sm text-[var(--muted)] line-clamp-3">
          {item.description}
        </p>

        {hasMultiple && (
          <p className="mt-2 text-xs text-[var(--muted)]">
            {images.length} photos · use arrows to browse
          </p>
        )}

        <Link
          href={`/request?item=${item.id}`}
          className="btn-primary mt-5 w-full text-sm"
        >
          {item.orderType === "available" ? "Order this piece" : "Order similar"}
        </Link>
      </div>
    </article>
  );
}
