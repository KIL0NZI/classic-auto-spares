'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowLeft, CircleHelp, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'

export default function SupportPage() {
  const [form, setForm] = useState({
    name: '',
    vehicle: '',
    issue: '',
  })

  const whatsappLink = useMemo(() => {
    const text = [
      'Hello Classic Auto Spares Parts, I need help finding the right car part.',
      form.name ? `Name: ${form.name}` : '',
      form.vehicle ? `Vehicle: ${form.vehicle}` : '',
      form.issue ? `Issue: ${form.issue}` : '',
    ]
      .filter(Boolean)
      .join('\n\n')

    return `https://wa.me/15551234567?text=${encodeURIComponent(text)}`
  }, [form])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:py-5 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label="Classic Auto Spares Parts home">
            <img src="/logo.png" alt="Classic Auto Spares logo" className="h-9 w-auto shrink-0 rounded-full object-cover ring-1 ring-border/70 sm:h-11" />
            <span className="truncate text-sm font-bold tracking-tight text-foreground sm:text-base">Classic Auto Spares</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground">
            <ArrowLeft className="size-4" /> Back home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-[0_20px_50px_rgba(0,0,0,0.16)] sm:p-10 lg:p-12">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Customer support</p>
            <h1 className="mt-3 font-mono text-3xl font-bold tracking-tight sm:text-4xl">We’re here to help</h1>
            <p className="mt-4 leading-7 text-muted-foreground">
              Need fitment advice, help with an order, or support after purchase? Reach out and our team will get back to you quickly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:parts@Classic Auto Spares.example?subject=Support%20Request"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-black transition hover:brightness-110"
              >
                <Mail className="size-4" /> Send us an email
              </a>
              <a
                href="tel:+254700000000"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-bold text-foreground transition hover:border-accent"
              >
                <Phone className="size-4" /> Call us now
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-border bg-card p-8">
            <h2 className="font-mono text-xl font-bold tracking-tight">Contact details</h2>
            <div className="mt-6 space-y-5 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 text-accent" />
                <div>
                  <p className="font-semibold text-foreground">Phone</p>
                  <a href="tel:+254700000000" className="mt-1 block hover:text-foreground">+254 700 000 000</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 text-accent" />
                <div>
                  <p className="font-semibold text-foreground">Email</p>
                  <a href="mailto:parts@Classic Auto Spares.example" className="mt-1 block hover:text-foreground">parts@Classic Auto Spares.example</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 text-accent" />
                <div>
                  <p className="font-semibold text-foreground">Visit</p>
                  <p className="mt-1">Yellow House, Kirinyaga Road<br />Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8">
            <h2 className="font-mono text-xl font-bold tracking-tight">Quick help</h2>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="mt-1 size-2 rounded-full bg-accent" /> Fitment support for make, model and year questions.</li>
              <li className="flex items-start gap-2"><span className="mt-1 size-2 rounded-full bg-accent" /> Order updates and delivery coordination.</li>
              <li className="flex items-start gap-2"><span className="mt-1 size-2 rounded-full bg-accent" /> Product availability and specialist part guidance.</li>
            </ul>

            <div className="mt-6 rounded-2xl border border-border bg-background/70 p-4">
              <label className="block text-sm font-medium text-foreground">
                Your name
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Jane Doe"
                  className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label className="mt-4 block text-sm font-medium text-foreground">
                Vehicle details
                <input
                  value={form.vehicle}
                  onChange={(event) => setForm((current) => ({ ...current, vehicle: event.target.value }))}
                  placeholder="BMW 3 Series 2019"
                  className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label className="mt-4 block text-sm font-medium text-foreground">
                Describe the problem
                <textarea
                  value={form.issue}
                  onChange={(event) => setForm((current) => ({ ...current, issue: event.target.value }))}
                  placeholder="I need a brake pad for the front axle..."
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-1"
              >
                <Send className="size-4" /> Send to WhatsApp
              </a>
            </div>

            <a
              href="https://wa.me/15551234567?text=Hello%2C%20I%20need%20help%20finding%20the%20right%20car%20part."
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-1"
            >
              <MessageCircle className="size-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section id="location" className="px-0 pb-8">
        <div className="relative overflow-hidden border-y border-border bg-card">
          <div className="absolute inset-0">
            <iframe
              title="Classic Auto Spares Parts location"
              src="https://www.google.com/maps?q=Yellow%20House%2C%20Kirinyaga%20Road%2C%20Nairobi%2C%20Kenya&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[420px] w-full border-0"
            />
          </div>
          <div className="relative flex min-h-[420px] items-end justify-start bg-gradient-to-t from-background/95 via-background/40 to-transparent p-6 sm:p-8 lg:p-10">
            <div className="max-w-md rounded-3xl border border-border/70 bg-background/85 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.16)] backdrop-blur">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Visit us</p>
              <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight sm:text-3xl">Find our workshop</h2>
              <p className="mt-3 leading-7 text-muted-foreground">Drop in for fitment advice, quick pickups, and specialist parts support.</p>
              <div className="mt-5 space-y-1 text-sm text-foreground">
                <p className="font-medium">Classic Auto Spares Parts</p>
                <p>Yellow House, Kirinyaga Road, Nairobi</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
