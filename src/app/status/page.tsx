"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  parseCSV,
  STATUS_LABELS,
  STATUS_COLORS,
} from "@/lib/utils";

/*
  SETUP – Google Sheet for status tracking:

  1. Create a Google Sheet with these exact column headers in row 1:
     tracking_code | status | progress_notes | created_at

  2. Add rows as you receive commissions (copy the tracking_code from the Formspree email).

  3. File → Share → Publish to web → choose the sheet → CSV → Publish.
     Copy the published CSV URL (looks like:
     https://docs.google.com/spreadsheets/d/e/XXXX/pub?output=csv)

  4. Paste that URL below (or set NEXT_PUBLIC_STATUS_SHEET_CSV in .env.local)

  Recommended statuses (use exactly these values):
  queued, accepted, materials_ordered, in_progress, quality_check, shipped, completed, cancelled
*/
const STATUS_SHEET_CSV =
  process.env.NEXT_PUBLIC_STATUS_SHEET_CSV ||
  "https://docs.google.com/spreadsheets/d/e/YOUR_PUBLISHED_SHEET_ID/pub?output=csv";

interface Row {
  tracking_code: string;
  status: string;
  progress_notes?: string;
  created_at?: string;
}

function StatusContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [commission, setCommission] = useState<Row | null>(null);
  const [error, setError] = useState("");
  const [publicQueue, setPublicQueue] = useState<Row[]>([]);
  const [sheetError, setSheetError] = useState("");

  // Load the public sheet once
  useEffect(() => {
    async function loadSheet() {
      try {
        const res = await fetch(STATUS_SHEET_CSV, { cache: "no-store" });
        if (!res.ok) throw new Error("Could not load status sheet");
        const text = await res.text();
        const rows = parseCSV(text);
        // Normalize keys to lowercase for safety
        const normalized = rows.map((r): Row => {
          const obj: Record<string, string> = {};
          Object.entries(r).forEach(([k, v]) => {
            obj[k.toLowerCase().trim()] = v;
          });
          return {
            tracking_code: obj.tracking_code ?? "",
            status: obj.status ?? "",
            progress_notes: obj.progress_notes,
            created_at: obj.created_at,
          };
        });
        setPublicQueue(
          normalized
            .filter((r) => r.tracking_code && r.status !== "cancelled")
            .sort((a, b) =>
              (b.created_at || "").localeCompare(a.created_at || "")
            )
            .slice(0, 40)
        );
      } catch {
        setSheetError(
          "Status sheet is not configured yet or is not publicly published."
        );
      }
    }
    loadSheet();
  }, []);

  // Auto-lookup if code in URL
  useEffect(() => {
    if (initialCode) {
      lookup(initialCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode, publicQueue]);

  function lookup(lookupCode?: string) {
    const c = (lookupCode || code).trim().toUpperCase();
    if (!c) return;

    setLoading(true);
    setError("");
    setCommission(null);

    const found = publicQueue.find(
      (r) => r.tracking_code?.toUpperCase() === c
    );

    if (found) {
      setCommission(found);
    } else if (publicQueue.length > 0) {
      setError("No commission found with that tracking code.");
    } else {
      setError(
        sheetError ||
          "Status data is not available yet. Please try again later."
      );
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Commission Status</h1>
        <p className="mt-3 text-[var(--muted)]">
          Enter your unique tracking code to see personal progress details.
        </p>
      </div>

      {/* Lookup form */}
      <div className="mx-auto mb-12 max-w-md">
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="LSP-XXXXXX"
            className="font-mono tracking-wider"
            onKeyDown={(e) => e.key === "Enter" && lookup()}
          />
          <button
            onClick={() => lookup()}
            disabled={loading || !code.trim()}
            className="btn-primary whitespace-nowrap"
          >
            {loading ? "..." : "Look Up"}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-center text-sm text-red-400">{error}</p>
        )}
      </div>

      {/* Personal result */}
      {commission && (
        <div className="mb-16 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--muted)]">Tracking Code</p>
              <p className="font-mono text-2xl font-bold text-[var(--accent)]">
                {commission.tracking_code}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium text-white ${
                STATUS_COLORS[commission.status] || "bg-slate-600"
              }`}
            >
              {STATUS_LABELS[commission.status] || commission.status}
            </span>
          </div>

          {commission.created_at && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
                Submitted / Added
              </p>
              <p className="mt-1">{commission.created_at}</p>
            </div>
          )}

          {commission.progress_notes && (
            <div className="mt-6 rounded-xl bg-[var(--background)] p-4">
              <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
                Progress Notes
              </p>
              <p className="mt-2 whitespace-pre-wrap">
                {commission.progress_notes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Public Queue */}
      <div>
        <h2 className="mb-2 text-xl font-bold">Public Waitlist</h2>
        <p className="mb-6 text-sm text-[var(--muted)]">
          General overview of recent commissions. No personal details are shown.
        </p>

        {sheetError && publicQueue.length === 0 ? (
          <p className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--muted)]">
            {sheetError}
          </p>
        ) : publicQueue.length === 0 ? (
          <p className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--muted)]">
            No commissions in the public queue yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--card)] text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {publicQueue.map((item) => (
                  <tr
                    key={item.tracking_code}
                    className="bg-[var(--background)]/50"
                  >
                    <td className="px-4 py-3 font-mono text-[var(--accent)]">
                      {item.tracking_code}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${
                          STATUS_COLORS[item.status] || "bg-slate-600"
                        }`}
                      >
                        {STATUS_LABELS[item.status] || item.status}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-[var(--muted)] sm:table-cell">
                      {item.created_at || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-10 text-center text-sm text-[var(--muted)]">
        Lost your code? Contact me with the email you used when requesting.{" "}
        <Link href="/request" className="text-[var(--accent)] hover:underline">
          Submit a new request →
        </Link>
      </p>
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-[var(--muted)]">
          Loading...
        </div>
      }
    >
      <StatusContent />
    </Suspense>
  );
}
