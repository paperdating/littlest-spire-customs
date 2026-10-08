"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { galleryItems, getGalleryTags } from "@/lib/gallery";
import GalleryCard from "@/components/GalleryCard";

export default function GalleryPage() {
  const tags = useMemo(() => getGalleryTags(), []);
  const [activeTag, setActiveTag] = useState<string>("All");
  const [orderFilter, setOrderFilter] = useState<"all" | "available" | "similar">(
    "all"
  );

  const filtered = useMemo(() => {
    return galleryItems.filter((item) => {
      if (activeTag !== "All" && item.tag !== activeTag) return false;
      if (orderFilter === "available" && item.orderType !== "available")
        return false;
      if (orderFilter === "similar" && item.orderType !== "similar") return false;
      return true;
    });
  }, [activeTag, orderFilter]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Gallery & Shop
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-[var(--muted)]">
          Browse pieces I&apos;ve made before. Click any item to order a
          similar version (or the piece if available). Prefer something
          completely unique?{" "}
          <Link href="/request" className="text-[var(--accent)] hover:underline">
            Request a custom commission
          </Link>
          .
        </p>
      </div>

      {/* Two paths */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="text-2xl">🖼️</div>
          <h2 className="mt-2 font-semibold">Order from the gallery</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Choose a past piece. I&apos;ll make a similar version tailored to
            you, or fulfill it if it&apos;s marked available.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="text-2xl">✨</div>
          <h2 className="mt-2 font-semibold">Fully custom commission</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Bring your own idea. Describe what you want and I&apos;ll craft
            something original for you.
          </p>
          <Link
            href="/request"
            className="mt-3 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
          >
            Start a custom request →
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Category chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Category
          </span>
          {["All", ...tags].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                activeTag === tag
                  ? "bg-[var(--accent-muted)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--foreground)]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Availability chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Type
          </span>
          {(
            [
              { key: "all", label: "All" },
              { key: "available", label: "Available now" },
              { key: "similar", label: "Made to order" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setOrderFilter(key)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                orderFilter === key
                  ? "bg-[var(--accent-muted)] text-white"
                  : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--foreground)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="mb-6 text-sm text-[var(--muted)]">
        Showing {filtered.length} of {galleryItems.length} pieces
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-12 text-center text-[var(--muted)]">
          No pieces match these filters.{" "}
          <button
            type="button"
            onClick={() => {
              setActiveTag("All");
              setOrderFilter("all");
            }}
            className="text-[var(--accent)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <GalleryCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <div className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <h2 className="text-xl font-bold">Don&apos;t see what you want?</h2>
        <p className="mt-2 text-[var(--muted)]">
          I love one-of-a-kind custom work. Tell me your idea and I&apos;ll
          add it to the same queue as gallery orders.
        </p>
        <Link href="/request" className="btn-primary mt-6 inline-flex">
          Request a Custom Commission
        </Link>
      </div>
    </div>
  );
}
