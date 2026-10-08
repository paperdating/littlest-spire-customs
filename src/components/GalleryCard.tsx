import Link from "next/link";
import type { GalleryItem } from "@/lib/gallery";

interface GalleryCardProps {
  item: GalleryItem;
  /** "square" for home teaser, "wide" for full gallery */
  aspect?: "square" | "wide";
}

export default function GalleryCard({ item, aspect = "wide" }: GalleryCardProps) {
  const aspectClass =
    aspect === "square" ? "aspect-square" : "aspect-[4/3]";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-all hover:border-[var(--accent)] hover:shadow-lg hover:shadow-violet-900/20">
      {/* Image / placeholder */}
      <div
        className={`relative ${aspectClass} overflow-hidden bg-gradient-to-br from-violet-950/80 to-indigo-950/60`}
      >
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.title}
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
