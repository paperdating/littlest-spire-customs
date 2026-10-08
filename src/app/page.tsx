import Link from "next/link";
import Portfolio from "@/components/Portfolio";
import PaymentButtons from "@/components/PaymentButtons";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5 text-sm text-[var(--muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
            Gallery open · Customs welcome
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              Littlest Spire Customs
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted)]">
            Handmade physical crafts. Browse the gallery to order a similar
            piece, or request a fully custom commission. Everything joins the
            same queue.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/gallery" className="btn-primary text-base px-8 py-3.5">
              Browse Gallery & Shop
            </Link>
            <Link href="/request" className="btn-secondary text-base px-8 py-3.5">
              Custom Commission
            </Link>
          </div>
          <p className="mt-4">
            <Link
              href="/status"
              className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
            >
              Already ordered? Check status →
            </Link>
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-[var(--border)] bg-[var(--card)]/30 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Choose or Describe",
                desc: "Pick a gallery piece to order a similar version, or request something fully custom.",
              },
              {
                step: "02",
                title: "Get Your Code",
                desc: "Submit the form and receive a unique tracking code instantly. Save it!",
              },
              {
                step: "03",
                title: "Payment & Work",
                desc: "Once accepted, pay via PayPal or Ko-fi. Then the crafting begins.",
              },
              {
                step: "04",
                title: "Track & Receive",
                desc: "Follow progress on the status page. Gallery and custom orders share one queue.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="mb-3 text-4xl font-black text-[var(--accent-muted)]/40">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery teaser */}
      <Portfolio />

      {/* Payments */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 sm:p-12">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">Payment Options</h2>
              <p className="mt-3 text-[var(--muted)]">
                Secure ways to pay after your request is accepted. Include your
                tracking code in the payment note.
              </p>
              <div className="mt-8 flex justify-center">
                <PaymentButtons />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to order or commission?
          </h2>
          <p className="mt-3 text-[var(--muted)]">
            Gallery pieces and fully custom work both go into the same waitlist.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/gallery" className="btn-primary px-8 py-3.5">
              Browse Gallery
            </Link>
            <Link href="/request" className="btn-secondary px-8 py-3.5">
              Start Custom Request
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
