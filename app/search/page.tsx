'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState, Suspense } from 'react'
import { useFitment } from '@/context/FitmentContext'
import { checkFitment } from '@/lib/fitment-checker'
import { FitmentBadge } from '@/components/FitmentBadge'
import {
  ArrowRight,
  ChevronDown,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Wrench,
  X,
} from 'lucide-react'
import { normalizePartCategory, partStore } from '@/lib/store'

const ALL_PRODUCTS = partStore.map((product) => {
  const firstCompatibility = product.compatibility[0]
  const fitment = product.compatibility.length
    ? product.compatibility
        .slice(0, 2)
        .map((item) => {
          const years = item.yearFrom && item.yearTo ? ` · ${item.yearFrom}–${item.yearTo}` : ''
          return `${item.make} ${item.model}${years}`
        })
        .join(' • ')
    : product.universalFit
      ? 'Universal fit'
      : 'Vehicle-specific fitment'

  return {
    slug: product.slug,
    name: product.name,
    code: product.code,
    category: normalizePartCategory(product.category),
    make: firstCompatibility?.make ?? 'Universal',
    price: product.price,
    fitment,
    tag: product.tag ?? (product.stock_quantity > 0 ? 'In stock' : 'Limited'),
    image: product.image ?? '/Classic Auto Spares-hero.png',
    rawProduct: product, // <-- Add this line
  }
})

const CATEGORIES = ['All', 'Braking', 'Engine', 'Suspension', 'Lighting', 'Cooling', 'Mirror']

const normalizeMake = (make: string | null | undefined) => make?.trim().toLowerCase() ?? ''
const SUPPORTED_MAKES = ['All', ...new Set(
  partStore.flatMap((product) => product.compatibility.map((item) => item.make).filter(Boolean))
)].sort((a, b) => (a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)))

function SearchResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { vehicle } = useFitment()

  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || 'All'
  const initialMake = searchParams.get('make') || 'All'
  const initialSort = searchParams.get('sort') || 'featured'

  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedMake, setSelectedMake] = useState(initialMake)
  const [sortBy, setSortBy] = useState(initialSort)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Update query params in URL
  const updateUrlParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'All') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    router.replace(`/search?${params.toString()}`, { scroll: false })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrlParams({ q: searchTerm })
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    updateUrlParams({ category })
  }

  const handleMakeChange = (make: string) => {
    setSelectedMake(make)
    updateUrlParams({ make })
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    updateUrlParams({ sort })
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
    setSelectedMake('All')
    setSortBy('featured')
    router.replace('/search')
  }

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const q = searchTerm.toLowerCase().trim()
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.code.toLowerCase().includes(q) ||
        product.fitment.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q)

      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const matchesMake = selectedMake === 'All' || normalizeMake(product.make) === normalizeMake(selectedMake)

      return matchesSearch && matchesCategory && matchesMake
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return 0
    })
  }, [searchTerm, selectedCategory, selectedMake, sortBy])

  const activeFiltersCount = (selectedCategory !== 'All' ? 1 : 0) + (selectedMake !== 'All' ? 1 : 0) + (searchTerm ? 1 : 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Top Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative mb-8 flex items-center">
        <Search className="pointer-events-none absolute left-4 size-5 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by part name, OEM code, or vehicle model..."
          className="h-14 w-full rounded-2xl border border-border bg-card pl-12 pr-28 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-2.5 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-accent-foreground transition hover:brightness-110"
        >
          Search
        </button>
      </form>

      {/* Header Info & Sort Controls */}
      <div className="mb-2">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-muted"
        >
          ‹ Back
        </button>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-tight">
            {searchTerm ? `Results for "${searchTerm}"` : 'Catalogue Search'}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{filteredProducts.length}</strong> matching parts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold lg:hidden"
          >
            <Filter className="size-3.5" />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              aria-label="Sort products by"
              className="h-10 appearance-none rounded-xl border border-border bg-card px-3.5 pr-9 text-xs font-semibold outline-none focus:border-accent"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Results */}
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 rounded-2xl border border-border bg-card p-6 h-fit sticky top-24">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider">
              <SlidersHorizontal className="size-4 text-accent" /> Filters
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3" /> Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Category
            </label>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-accent font-bold text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Make Filter */}
          <div className="border-t border-border/60 pt-4">
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Vehicle Make
            </label>
            <div className="space-y-1">
              {SUPPORTED_MAKES.map((make) => (
                <button
                  key={make}
                  onClick={() => handleMakeChange(make)}
                  className={`block w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition ${
                    selectedMake === make
                      ? 'bg-accent font-bold text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {make}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Results Grid (3 Columns on desktop) */}
        <main className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
  // Compute fitment status against the user's active garage vehicle
  const fitmentResult = checkFitment(product.rawProduct, vehicle)

  return (
    <Link
      key={product.code}
      href={`/parts/${product.slug}`}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-1 hover:border-accent hover:shadow-lg"
    >
      <div>
        <div className="relative h-44 w-full overflow-hidden rounded-xl bg-muted/40">
          <img
            src={product.image}
            alt={product.name}
            className="size-full object-cover object-center transition duration-300 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
            {product.tag}
          </span>
        </div>

        <div className="mt-4">
          <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
            {product.category}
          </span>
          <h3 className="mt-1 font-mono text-base font-bold transition group-hover:text-accent">
            {product.name}
          </h3>

          {/* Fitment Badge Component */}
          <div className="mt-2">
            {/* Adapted to FitmentBadge props: expect status and label */}
            <FitmentBadge status={fitmentResult.status} label={fitmentResult.label} />
          </div>

          <p className="mt-2 text-xs text-muted-foreground">{product.fitment}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
        <span className="font-mono text-sm font-bold text-foreground">
          KES {product.price.toLocaleString()}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-accent group-hover:underline">
          View Part <ArrowRight className="size-3" />
        </span>
      </div>
    </Link>
  )
})}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center">
              <Search className="size-10 text-muted-foreground" />
              <h3 className="mt-4 font-mono text-lg font-bold">No parts match your criteria</h3>
              <p className="mt-2 text-xs text-muted-foreground max-w-sm">
                Try clearing your make or category filters, or search for generic terms like "Brakes" or "Pads".
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-5 rounded-full bg-accent px-5 py-2 text-xs font-bold text-accent-foreground hover:brightness-110"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-background/80 backdrop-blur lg:hidden">
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="font-mono text-base font-bold uppercase">Filters</span>
              <button onClick={() => setMobileFilterOpen(false)} aria-label="Close filters">
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto py-4">
              <div>
                <label className="block font-mono text-xs font-bold uppercase text-muted-foreground mb-2">Category</label>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-xs ${selectedCategory === cat ? 'bg-accent font-bold text-accent-foreground' : 'text-muted-foreground'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <label className="block font-mono text-xs font-bold uppercase text-muted-foreground mb-2">Vehicle Make</label>
                <div className="space-y-1">
                  {SUPPORTED_MAKES.map((make) => (
                    <button
                      key={make}
                      onClick={() => handleMakeChange(make)}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-xs ${selectedMake === make ? 'bg-accent font-bold text-accent-foreground' : 'text-muted-foreground'}`}
                    >
                      {make}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-auto w-full rounded-xl bg-accent py-3 text-xs font-bold text-accent-foreground"
            >
              Apply & Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<div className="p-10 text-center font-mono text-xs">Loading search...</div>}>
        <SearchResultsContent />
      </Suspense>
    </main>
  )
}