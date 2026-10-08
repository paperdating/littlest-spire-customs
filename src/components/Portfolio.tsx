import Link from "next/link";
import { galleryItems } from "@/lib/gallery";

/** Teaser of the gallery shown on the home page */
export default function Portfolio() {
  const preview = galleryItems.slice(0, 4);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Gallery & Shop
          </h2>
          <p className="mt-3 text-[var(--muted)]">
            Browse past work and order a similar piece — or request something
            completely custom. Everything joins the same queue.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((item) => (
            <Link
              key={item.id}
              href={`/request?item=${item.id}`}
              className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition-all hover:border-[var(--accent)] hover:shadow-lg hover:shadow-violet-900/20"
            >
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-violet-950/80 to-indigo-950/60">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-5xl opacity-40 transition-opacity group-hover:opacity-70">
                      {item.emoji}
                    </span>
                  </div>
                )}
                <span className="absolute right-3 top-3 rounded-full bg-[var(--accent-muted)]/80 px-2.5 py-0.5 text-xs font-medium text-white">
                  {item.tag}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-[var(--foreground)]">
                    {item.title}
                  </h3>
                  <span className="shrink-0 rounded-md bg-[var(--accent-muted)]/15 px-2 py-0.5 text-xs font-semibold text-[var(--accent)]">
                    {item.priceHint}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)] line-clamp-2">
                  {item.description}
                </p>
                <p className="mt-3 text-xs font-medium text-[var(--accent)]">
                  {item.orderType === "available"
                    ? "Order this →"
                    : "Order similar →"}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/gallery" className="btn-secondary">
            View full gallery
          </Link>
          <Link href="/request" className="btn-primary">
            Custom commission instead
          </Link>
        </div>
      </div>
    </section>
  );
}
