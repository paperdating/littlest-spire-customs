"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PaymentButtons from "@/components/PaymentButtons";
import { generateTrackingCode } from "@/lib/utils";
import { getGalleryItem, getItemImages, type GalleryItem } from "@/lib/gallery";

/*
  SETUP:
  1. Create a free account at https://formspree.io
  2. Create a new form and copy the endpoint
  3. Set NEXT_PUBLIC_FORMSPREE_ENDPOINT in .env.local
*/
const FORMSPREE_ENDPOINT =
  process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ||
  "https://formspree.io/f/YOUR_FORM_ID";

function RequestForm() {
  const searchParams = useSearchParams();
  const itemId = searchParams.get("item");

  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    description: "",
    budget: "",
    shipping_info: "",
    order_type: "custom" as "custom" | "gallery",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ tracking_code: string } | null>(null);
  const [error, setError] = useState("");

  // Prefill when coming from gallery
  useEffect(() => {
    if (!itemId) return;
    const item = getGalleryItem(itemId);
    if (!item) return;

    setSelectedItem(item);
    setForm((prev) => ({
      ...prev,
      order_type: "gallery",
      description:
        prev.description ||
        `I would like to order ${
          item.orderType === "available" ? "this piece" : "a similar piece"
        }:\n\n` +
          `Title: ${item.title}\n` +
          `Category: ${item.tag}\n` +
          `Price guide: ${item.priceHint}\n\n` +
          `Additional notes / customizations:\n`,
      budget: prev.budget || item.priceHint,
    }));
  }, [itemId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const tracking_code = generateTrackingCode();

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...form,
          tracking_code,
          gallery_item: selectedItem?.title || "",
          gallery_item_id: selectedItem?.id || "",
          _subject: selectedItem
            ? `Gallery Order – ${selectedItem.title} – ${tracking_code}`
            : `Custom Commission – ${tracking_code}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed. Please try again.");
      }

      setResult({ tracking_code });
      setForm({
        customer_name: "",
        customer_email: "",
        description: "",
        budget: "",
        shipping_info: "",
        order_type: "custom",
      });
      setSelectedItem(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit. Check your connection or try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-[var(--success)]/30 bg-[var(--card)] p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-3xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-[var(--success)]">
            Request Received!
          </h1>
          <p className="mt-3 text-[var(--muted)]">
            Thank you! Your request has been added to the queue. Keep your
            tracking code safe.
          </p>

          <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
            <p className="text-sm text-[var(--muted)]">Your tracking code</p>
            <p className="mt-2 font-mono text-3xl font-bold tracking-wider text-[var(--accent)]">
              {result.tracking_code}
            </p>
            <p className="mt-3 text-xs text-[var(--muted)]">
              Screenshot or write this down. It was also included in the
              notification sent to me.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href={`/status?code=${result.tracking_code}`}
              className="btn-primary w-full"
            >
              View Status Page
            </Link>
            <Link href="/gallery" className="btn-secondary w-full">
              Back to Gallery
            </Link>
          </div>

          <div className="mt-10 border-t border-[var(--border)] pt-8">
            <p className="mb-4 text-sm text-[var(--muted)]">
              Prefer to support early? Include your tracking code in the note:
            </p>
            <PaymentButtons compact />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">
          {selectedItem ? "Order from Gallery" : "Custom Commission"}
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          {selectedItem
            ? "Review the details below, add any customizations, and submit. This joins the same queue as custom work."
            : "Describe your idea. Gallery orders and fully custom requests all go into the same waitlist."}
        </p>
      </div>

      {selectedItem && (
        <div className="mb-6 flex items-start gap-4 rounded-xl border border-[var(--accent)]/40 bg-[var(--card)] p-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-violet-950 to-indigo-950">
            {getItemImages(selectedItem)[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getItemImages(selectedItem)[0]}
                alt={selectedItem.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl">
                {selectedItem.emoji}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold">{selectedItem.title}</h2>
              <span className="rounded-full bg-[var(--accent-muted)]/80 px-2 py-0.5 text-xs text-white">
                {selectedItem.tag}
              </span>
              <span className="rounded-md bg-[var(--accent-muted)]/15 px-2 py-0.5 text-sm font-semibold text-[var(--accent)]">
                {selectedItem.priceHint}
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {selectedItem.description}
            </p>
            <p className="mt-2 text-xs text-[var(--muted)]">
              {selectedItem.orderType === "available"
                ? "Marked as available / can be fulfilled as shown or with small changes."
                : "Made-to-order inspired by this piece — tell me your preferred colors, size, or changes."}
              {getItemImages(selectedItem).length > 1 &&
                ` · ${getItemImages(selectedItem).length} sample photos on gallery card`}
            </p>
          </div>
          <Link
            href="/request"
            className="shrink-0 text-xs text-[var(--muted)] hover:text-[var(--accent)]"
          >
            Clear
          </Link>
        </div>
      )}

      {!selectedItem && (
        <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--card)]/50 p-4 text-center text-sm text-[var(--muted)]">
          Want to order something from past work instead?{" "}
          <Link href="/gallery" className="text-[var(--accent)] hover:underline">
            Browse the gallery →
          </Link>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Your Name <span className="text-red-400">*</span>
          </label>
          <input
            required
            type="text"
            value={form.customer_name}
            onChange={(e) =>
              setForm({ ...form, customer_name: e.target.value })
            }
            placeholder="How should I address you?"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            required
            type="email"
            value={form.customer_email}
            onChange={(e) =>
              setForm({ ...form, customer_email: e.target.value })
            }
            placeholder="you@example.com"
          />
          <p className="mt-1 text-xs text-[var(--muted)]">
            Used only for order updates. Never shared.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            {selectedItem
              ? "Details & customizations"
              : "Commission description"}{" "}
            <span className="text-red-400">*</span>
          </label>
          <textarea
            required
            rows={6}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder={
              selectedItem
                ? "Any changes to colors, size, materials, or extra details..."
                : "Describe what you'd like made: type of item, size, colors, materials, style, references..."
            }
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Budget Range
          </label>
          <select
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
          >
            <option value="">Select a range (optional)</option>
            <option value="Under $50">Under $50</option>
            <option value="$50 – $100">$50 – $100</option>
            <option value="$100 – $200">$100 – $200</option>
            <option value="$200 – $400">$200 – $400</option>
            <option value="$400+">$400+</option>
            <option value="Flexible / Discuss">Flexible / Discuss</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Shipping Info (optional)
          </label>
          <textarea
            rows={2}
            value={form.shipping_info}
            onChange={(e) =>
              setForm({ ...form, shipping_info: e.target.value })
            }
            placeholder="Country / region, or full address if you're ready."
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5"
        >
          {loading
            ? "Submitting..."
            : selectedItem
              ? "Submit Gallery Order"
              : "Submit Custom Commission"}
        </button>

        <p className="text-center text-xs text-[var(--muted)]">
          This is a request, not a confirmed order. Payment is only requested
          after acceptance. Gallery and custom orders share the same queue.
        </p>
      </form>
    </div>
  );
}

export default function RequestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-[var(--muted)]">
          Loading...
        </div>
      }
    >
      <RequestForm />
    </Suspense>
  );
}
