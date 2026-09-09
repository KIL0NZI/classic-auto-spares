'use client'

import Link from 'next/link'
import { use, useMemo } from 'react'
import { ArrowRight, ChevronRight, Wrench } from 'lucide-react'
import { getProductBySlug, getProductsForVehicle, getVehicleTypeBySlug, vehicleTypes } from '@/lib/catalog-data'

export default function VehiclePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const vehicle = getVehicleTypeBySlug(resolvedParams.slug)
  const products = useMemo(() => getProductsForVehicle(resolvedParams.slug), [resolvedParams.slug])

  if (!vehicle) {
    return <div className="p-10 text-sm text-muted-foreground">Vehicle type not found.</div>
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Classic Auto Spares Parts home">
            <img src="/logo.png" alt="Classic Auto Spares logo" className="h-12 w-auto object-contain sm:h-14" />
          </Link>
          <Link href="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground">Back to home</Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
        <div className="rounded-[2rem] border border-border bg-card p-8 sm:p-10">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Vehicle fitment</p>
          <h1 className="mt-3 font-mono text-3xl font-bold tracking-tight sm:text-4xl">{vehicle.name}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{vehicle.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {vehicleTypes.map((item) => (
              <Link key={item.slug} href={`/vehicles/${item.slug}`} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${item.slug === resolvedParams.slug ? 'bg-white text-background' : 'border border-border text-muted-foreground hover:border-accent hover:text-foreground'}`}>
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Link key={product.slug} href={`/parts/${product.slug}`} className="rounded-[1.5rem] border border-border bg-background/60 p-5 transition hover:-translate-y-1 hover:border-accent">
                <p className="text-sm font-semibold text-accent">{product.tag}</p>
                <h2 className="mt-2 font-mono text-xl font-bold">{product.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{product.fitment}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-semibold">{product.price}</span>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">View part <ChevronRight className="size-4" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
