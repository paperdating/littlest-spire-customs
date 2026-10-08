import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--card)]/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-[var(--foreground)]">
              🏰 Littlest Spire Customs
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Handmade physical crafts & customs, made with love.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/gallery" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
              Gallery & Shop
            </Link>
            <Link href="/request" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
              Custom Commission
            </Link>
            <Link href="/status" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
              Check Status
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} Littlest Spire Customs. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
