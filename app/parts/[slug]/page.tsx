'use client'

import Link from 'next/link'
import { use, useState, useMemo } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Truck,
  Wrench,
  PackageCheck,
  Share2,
} from 'lucide-react'
import { addToCart } from '@/lib/cart'
import { getProductBySlug, getRelatedProducts } from '@/lib/catalog-data'

const parseCurrencyValue = (value: string) => Number(value.replace(/[^\d.]/g, '').replace(/,/g, '')) || 0

export default function PartPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const product = getProductBySlug(resolvedParams.slug)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [copied, setCopied] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const relatedProducts = useMemo(() => {
    return product ? getRelatedProducts(product) : []
  }, [product])

  const whatsappInquiryUrl = useMemo(() => {
    if (!product) return ''
    const message = [
      `Hello Classic Auto Spares Parts, I am interested in ordering:`,
      `Part: ${product.name}`,
      `OEM / Code: ${product.code}`,
      `Fitment: ${product.fitment}`,
      `Quantity: ${quantity}`,
      `Price: ${product.price}`,
    ].join('\n')

    return `https://wa.me/15551234567?text=${encodeURIComponent(message)}`
  }, [product, quantity])

  if (!product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <Wrench className="size-12 text-muted-foreground" />
        <h1 className="mt-4 font-mono text-2xl font-bold">Part Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested part slug does not exist or has been removed from the catalogue.
        </p>
        <Link
          href="/#catalogue"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground transition hover:brightness-110"
        >
          Return to Catalogue <ArrowRight className="size-4" />
        </Link>
      </main>
    )
  }

  const images = product.images?.length ? product.images : ['/Classic Auto Spares-hero.png']

  const nextImage = () => setActiveImage((curr) => (curr + 1) % images.length)
  const prevImage = () => setActiveImage((curr) => (curr - 1 + images.length) % images.length)

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    addToCart({
      slug: product.slug,
      name: product.name,
      code: product.code,
      price: parseCurrencyValue(product.price),
      quantity,
      image: images[activeImage],
    })

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1800)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top Banner */}
      <div className="border-b border-border bg-primary px-4 py-2 text-center text-xs font-medium tracking-wide text-primary-foreground">
        Free workshop pickup available · 100% Guaranteed OEM fitment support
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label="Classic Auto Spares Parts home">
            <img src="/logo.png" alt="Classic Auto Spares logo" className="h-9 w-auto shrink-0 rounded-full object-cover ring-1 ring-border/70 sm:h-11" />
            <span className="truncate text-sm font-bold tracking-tight text-foreground sm:text-base">Classic Auto Spares</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground transition hover:border-accent hover:text-foreground sm:px-3 sm:text-xs"
            >
              <Share2 className="size-3.5" />
              {copied ? 'Copied' : 'Share'}
            </button>
            <Link
              href="/#catalogue"
              className="rounded-full border border-border px-3 py-1.5 text-[11px] font-bold text-muted-foreground transition hover:border-accent hover:text-foreground sm:px-4 sm:text-xs"
            >
              Back to Catalogue
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
        {/* Breadcrumb Path */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/#catalogue" className="hover:text-foreground">Catalogue</Link>
          <span>/</span>
          <span className="capitalize">{product.tag || 'Parts'}</span>
          <span>/</span>
          <span className="truncate font-semibold text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left: Gallery (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-lg">
              <div className="relative h-[360px] sm:h-[460px] w-full overflow-hidden bg-muted/40">
                <img
                  src={images[activeImage]}
                  alt={`${product.name} view ${activeImage + 1}`}
                  className="size-full object-cover object-center transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-2 text-foreground backdrop-blur transition hover:bg-background"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-2 text-foreground backdrop-blur transition hover:bg-background"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-4 rounded-full bg-background/80 px-3 py-1 font-mono text-xs font-semibold backdrop-blur">
                {activeImage + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setActiveImage(index)}
                    className={`relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-card transition ${
                      activeImage === index ? 'border-accent ring-2 ring-accent/30' : 'border-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={image} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Technical Specs & Fitment Grid */}
            <div className="mt-8 rounded-[2rem] border border-border bg-card p-6 sm:p-8">
              <h2 className="font-mono text-lg font-bold">Fitment & Specifications</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                <div className="rounded-xl border border-border/80 bg-background/60 p-3.5">
                  <span className="text-xs uppercase text-muted-foreground font-mono">Compatible Vehicle</span>
                  <p className="mt-1 font-semibold">{product.fitment}</p>
                </div>
                <div className="rounded-xl border border-border/80 bg-background/60 p-3.5">
                  <span className="text-xs uppercase text-muted-foreground font-mono">Part / OEM Code</span>
                  <p className="mt-1 font-mono font-semibold">{product.code}</p>
                </div>
                <div className="rounded-xl border border-border/80 bg-background/60 p-3.5">
                  <span className="text-xs uppercase text-muted-foreground font-mono">Condition</span>
                  <p className="mt-1 font-semibold">Brand New / OEM Spec</p>
                </div>
                <div className="rounded-xl border border-border/80 bg-background/60 p-3.5">
                  <span className="text-xs uppercase text-muted-foreground font-mono">Availability</span>
                  <p className="mt-1 font-semibold text-emerald-400">In Stock (Dispatches in 24h)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Sticky Order Box (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-[2rem] border border-border bg-card p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent">
                  {product.tag || 'Genuine Part'}
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {product.code}
                </span>
              </div>

              <h1 className="mt-4 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-2 border-b border-border/60 pb-5">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Price:</span>
                <span className="font-mono text-3xl font-extrabold text-foreground">{product.price}</span>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-background/60 p-3">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex size-7 items-center justify-center rounded-lg border border-border bg-card text-sm font-bold hover:border-accent"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-mono text-sm font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex size-7 items-center justify-center rounded-lg border border-border bg-card text-sm font-bold hover:border-accent"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-accent px-6 py-4 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/20 transition hover:brightness-110"
              >
                {addedToCart ? 'Added to cart' : 'Add to cart'}
              </button>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 border border-emerald-400/30 bg-emerald-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
              >
                <MessageCircle className="size-5" /> Inquire / Order on WhatsApp
              </a>

              {/* Assurance Items */}
              <div className="mt-6 space-y-3 border-t border-border/60 pt-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2.5">
                  <PackageCheck className="size-4 text-accent" />
                  <span>Inspected for quality and correct fitment before dispatch</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck className="size-4 text-accent" />
                  <span>Express courier delivery or Nairobi workshop pickup</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="size-4 text-accent" />
                  <span>Verified manufacturer warranty on eligible items</span>
                </div>
              </div>

              {/* Key Highlights */}
              {product.highlights?.length > 0 && (
                <div className="mt-6 border-t border-border/60 pt-6">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                    Key Highlights
                  </h3>
                  <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                    {product.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-accent" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-14 rounded-[2.5rem] border border-border bg-card p-6 sm:p-10">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Complementary Components
                </p>
                <h2 className="mt-1 font-mono text-2xl font-bold tracking-tight">
                  Frequently Paired With
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Matched for your vehicle
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((item) => (
                <Link
                  key={item.slug}
                  href={`/parts/${item.slug}`}
                  className="group rounded-2xl border border-border bg-background/60 p-5 transition hover:-translate-y-1 hover:border-accent hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-accent">
                      {item.tag || 'Recommended'}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{item.code}</span>
                  </div>
                  <h3 className="mt-3 font-mono text-base font-bold transition group-hover:text-accent">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{item.fitment}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-sm font-semibold">
                    <span className="font-mono font-bold">{item.price}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-accent group-hover:underline">
                      View Part <ArrowRight className="size-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}