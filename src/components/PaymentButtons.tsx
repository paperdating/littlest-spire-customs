const paypalLink = process.env.NEXT_PUBLIC_PAYPAL_LINK || "https://paypal.me/yourusername";
const kofiLink = process.env.NEXT_PUBLIC_KOFI_LINK || "https://ko-fi.com/yourusername";

export default function PaymentButtons({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 max-w-lg"}`}>
      <a
        href={paypalLink}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-payment"
      >
        <span className="text-2xl">💙</span>
        <div className="text-left">
          <div className="font-semibold">PayPal</div>
          <div className="text-xs text-[var(--muted)]">Secure payment</div>
        </div>
      </a>
      <a
        href={kofiLink}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-payment"
      >
        <span className="text-2xl">☕</span>
        <div className="text-left">
          <div className="font-semibold">Ko-fi</div>
          <div className="text-xs text-[var(--muted)]">Support & commissions</div>
        </div>
      </a>
    </div>
  );
}
