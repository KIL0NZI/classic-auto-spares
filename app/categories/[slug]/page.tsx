'use client'

import Link from 'next/link'
import { use, useMemo, useState } from 'react'
import { ArrowRight, ChevronRight, Search, SlidersHorizontal, Wrench } from 'lucide-react'
import { categories, getCategoryBySlug, getProductsForCategory } from '@/lib/catalog-data'

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const category = getCategoryBySlug(resolvedParams.slug)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')

  const products = useMemo(() => {
    const items = getProductsForCategory(resolvedParams.slug)
    const normalizedQuery = query.trim().toLowerCase()

    const filtered = normalizedQuery
      ? items.filter((product) => {
          const haystack = `${product.name} ${product.code} ${product.fitment}`.toLowerCase()
          return haystack.includes(normalizedQuery)
        })
      : items

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'price-low') {
        return Number.parseFloat(a.price.replace('$', '')) - Number.parseFloat(b.price.replace('$', ''))
      }
      if (sortBy === 'price-high') {
        return Number.parseFloat(b.price.replace('$', '')) - Number.parseFloat(a.price.replace('$', ''))
      }
      if (sortBy === 'newest') {
        return a.tag === 'New arrival' ? -1 : 1
      }
      return 0
    })

    return sorted
  }, [resolvedParams.slug, query, sortBy])

  if (!category) {
    return <div className="p-10 text-sm text-muted-foreground">Category not found.</div>
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Classic Auto Spares Parts home">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground"><Wrench className="size-5" /></span>
            <span className="font-mono text-lg font-bold tracking-tight">Classic Auto Spares<span className="text-accent">.</span></span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground">Back to home</Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
        <div className="rounded-[2rem] border border-border bg-card p-8 sm:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">{category.accent}</p>
              <h1 className="mt-3 font-mono text-3xl font-bold tracking-tight sm:text-4xl">{category.name}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{category.description}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm text-muted-foreground">
              {category.count} parts in this category
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-[1.75rem] border border-border bg-card p-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search this category"
                className="h-12 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Browse categories</p>
              <div className="mt-3 space-y-2">
                {categories.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/categories/${item.slug}`}
                    className={`flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium transition ${item.slug === resolvedParams.slug ? 'bg-accent text-black shadow-sm' : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'}`}
                  >
                    <span>{item.name}</span>
                    <span className="text-xs">{item.count}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-background/70 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <SlidersHorizontal className="size-4 text-accent" /> Sort by
              </div>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="mt-3 h-11 w-full rounded-2xl border border-border bg-background px-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </aside>

          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-border bg-card px-4 py-3">
              <p className="text-sm text-muted-foreground">Showing {products.length} parts</p>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span className="text-foreground">{category.name}</span>
                <ArrowRight className="size-4" />
                <span>Parts</span>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
                {products.map((product) => (
                  <Link key={product.slug} href={`/parts/${product.slug}`} className="group overflow-hidden rounded-[1.5rem] border border-border bg-card transition hover:-translate-y-1 hover:border-accent">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img src={product.image} alt={product.name} className="size-full object-cover opacity-80 transition duration-500 group-hover:scale-105" />
                      <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">{product.tag}</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{category.name}</p>
                          <h2 className="mt-1 font-mono text-lg font-bold">{product.name}</h2>
                        </div>
                        <p className="font-mono text-lg font-bold">{product.price}</p>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{product.fitment}</p>
                      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                        <span className="font-mono text-xs text-muted-foreground">{product.code}</span>
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-accent">View part <ChevronRight className="size-4" /></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-border bg-card py-16 text-center">
                <Search className="size-8 text-muted-foreground" />
                <h3 className="mt-4 font-mono text-lg font-bold">No parts found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try a different part name, code or fitment phrase.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
