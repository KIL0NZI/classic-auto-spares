'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useEffect, useRef } from 'react'
import { useFitment } from '@/context/FitmentContext'
import { checkFitment } from '@/lib/fitment-checker'
import { FitmentBadge } from '@/components/FitmentBadge'
import { normalizePartCategory, partStore } from '@/lib/store'
import {
  ArrowRight,
  ChevronDown,
  CircleHelp,
  Menu,
  MessageCircle,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react'

const categories = [
  { name: 'Braking', count: 42, icon: '◒', slug: 'braking', subcategories: ['Disc brakes', 'Pads', 'Calipers'] },
  { name: 'Engine', count: 86, icon: '◈', slug: 'engine', subcategories: ['Filters', 'Cooling', 'Timing'] },
  { name: 'Suspension', count: 31, icon: '⌁', slug: 'suspension', subcategories: ['Springs', 'Shocks', 'Bushings'] },
  { name: 'Electrical', count: 54, icon: 'ϟ', slug: 'electrical', subcategories: ['Batteries', 'Sensors', 'Wiring'] },
  { name: 'Body & Exterior', count: 28, icon: '◇', slug: 'body-and-exterior', subcategories: ['Panels', 'Trim', 'Glass'] },
  { name: 'Lighting', count: 18, icon: '☼', slug: 'lighting', subcategories: ['Headlights', 'Bulbs', 'LEDs'] },
  { name: 'Cooling', count: 15, icon: '❄', slug: 'cooling', subcategories: ['Radiators', 'Fans', 'Thermostats'] },
  { name: 'Mirror', count: 9, icon: '◌', slug: 'mirror', subcategories: ['Mirror caps', 'Glass', 'Housing'] },
  { name: 'Accessory', count: 23, icon: '✧', slug: 'accessory', subcategories: ['Interior', 'Exterior', 'Tools'] },
]


const vehicleTypes = ['Any vehicle', 'BMW', 'chevrolet', 'VW', 'Mercedes', 'mazda', 'suzuki', 'toyota', 'mercedes', 'mitsubishi', 'honda',]
const vehicleModels = ['Any model', '3 Series', 'A4', 'Golf GTI', 'C-Class', 'WRX', '911']
const vehicleYears = ['Any year', '2012', '2013', '2014', '2015', '2017', '2019', '2020', '2021']


export default function Page() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All parts')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [enquiryCount, setEnquiryCount] = useState(0)
  const { vehicle, setVehicle } = useFitment()

  // Initialize with the vehicle from context if available
  const [vehicleType, setVehicleType] = useState(vehicle?.make || 'Any vehicle')
  const [vehicleModel, setVehicleModel] = useState(vehicle?.model || 'Any model')
  const [vehicleYear, setVehicleYear] = useState(vehicle?.year || 'Any year')

  // Keep dropdowns in sync if the global vehicle updates elsewhere
  useEffect(() => {
    if (vehicle) {
      if (vehicle.make) setVehicleType(vehicle.make)
      if (vehicle.model) setVehicleModel(vehicle.model)
      if (vehicle.year) setVehicleYear(vehicle.year)
    }
  }, [vehicle])

  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [helpForm, setHelpForm] = useState({
    name: '',
    vehicle: '',
    issue: '',
  })
  const [isFitmentModalOpen, setIsFitmentModalOpen] = useState(false)


  const whatsappHelpLink = useMemo(() => {
    const text = [
      'Hello Classic Auto Spares Parts, I need help finding the right car part.',
      helpForm.name ? `Name: ${helpForm.name}` : '',
      helpForm.vehicle ? `Vehicle details: ${helpForm.vehicle}` : '',
      helpForm.issue ? `Additional information: ${helpForm.issue}` : '',
    ]
      .filter(Boolean)
      .join('\n\n')

    return `https://wa.me/15551234567?text=${encodeURIComponent(text)}`
  }, [helpForm])

  // Filter catalog by Category, Query, and Vehicle Compatibility
  // const filteredProducts = useMemo(() => {
  //   return partStore.filter((product) => {
  //     const productCategory = normalizePartCategory(product.category)
  //     const matchesCategory = activeCategory === 'All parts' || productCategory === activeCategory
  //     const haystack = `${product.name} ${productCategory} ${product.code} ${product.sku}`.toLowerCase()
  //     const matchesQuery = haystack.includes(query.toLowerCase())

  //     // Run vehicle fitment check
  //     const fitmentInfo = checkFitment(product, {
  //       make: vehicleType,
  //       model: vehicleModel,
  //       year: vehicleYear,
  //     })
  //     const matchesVehicle = fitmentInfo.status !== 'incompatible'

  //     return matchesCategory && matchesQuery && matchesVehicle
  //   })
  // }, [activeCategory, query, vehicleModel, vehicleType, vehicleYear])

  // Compute live auto-suggestions from partStore
  const suggestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return []

    return partStore
      .filter((p) => {
        const target = `${p.name} ${p.code} ${p.category} ${p.sku}`.toLowerCase()
        return target.includes(trimmed)
      })
      .slice(0, 5)
  }, [query])

  const heroSlides = useMemo(() => [
    {
      title: 'The right part. The first time.',
      eyebrow: 'Parts that keep you moving',
      subtitle: 'A carefully selected catalogue of reliable parts for drivers who care what is under the hood.',
      image: '/Classic Auto Spares-hero.png',
      cta: 'Browse catalogue',
      href: '#catalogue',
    },
    {
      title: 'Facelift kits available',
      eyebrow: 'Upgrade your look',
      subtitle: 'Premium facelift kits and styling parts for popular models.',
      image: '/Classic Auto Spares-hero.png',
      cta: 'See kits',
      href: '#catalogue',
    },
    {
      title: 'Effortless shopping & shipping',
      eyebrow: 'Fast & simple',
      subtitle: 'Fast delivery, easy returns, and expert fitment support.',
      image: '/Classic Auto Spares-hero.png',
      cta: 'Get support',
      href: '#support',
    },
  ], [])

  const [currentSlide, setCurrentSlide] = useState(0)

  const [animatedCount, setAnimatedCount] = useState(0)

  const heroTrackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const target = 240
    const duration = 1200
    const intervalMs = 30
    const steps = Math.max(1, Math.floor(duration / intervalMs))
    const increment = Math.ceil(target / steps)
    let current = 0
    const id = window.setInterval(() => {
      current += increment
      if (current >= target) {
        setAnimatedCount(target)
        clearInterval(id)
      } else {
        setAnimatedCount(current)
      }
    }, intervalMs)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    let id: number | null = null
    const timer = window.setTimeout(() => {
      id = window.setInterval(() => setCurrentSlide((s) => (s + 1) % heroSlides.length), 5000)

      // Mark JS active and pause CSS-only hero fallback now that the interval is running
      try { document.body.classList.add('js-active') } catch (e) { /* ignore server */ }
      if (heroTrackRef.current) {
        const style = heroTrackRef.current.style as CSSStyleDeclaration
        style.transitionProperty = 'transform'
        style.transitionDuration = '700ms'
        style.transitionTimingFunction = 'ease-in-out'
        style.animationPlayState = 'paused'
      }
    }, 50)

    return () => {
      if (id) clearInterval(id)
      clearTimeout(timer)
    }
  }, [heroSlides.length])

  // mark JS active so CSS-only fallbacks pause when client JS runs
  // NOTE: enable JS-driven behavior (and pause CSS fallbacks) only after
  // the relevant JS loops/intervals start. This avoids pausing CSS when
  // client JS fails to load and leaving the page static.

  const nextSlide = () => setCurrentSlide((s) => (s + 1) % heroSlides.length)
  const prevSlide = () => setCurrentSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)

  const brands = vehicleTypes.filter((v) => v !== 'Any vehicle')
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({})

  // Auto-advance the active brand when not paused
  // useEffect(() => {
  //   if (typeof window === 'undefined') return
  //   if (brands.length === 0) return
  //   let id: number | null = null
  //   if (!brandPaused) {
  //     id = window.setInterval(() => {
  //       setCurrentBrand((c) => (c + 1) % brands.length)
  //     }, 2200)
  //   }
  //   return () => { if (id) clearInterval(id) }
  // }, [brandPaused, brands.length])

  // // Center the current brand whenever it changes
  // useEffect(() => {
  //   const inner = brandInnerRef.current
  //   if (!inner) return
  //   const item = inner.children[currentBrand] as HTMLElement | undefined
  //   if (!item) return
  //   try {
  //     item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  //   } catch (e) {
  //     // fallback: compute offset and scroll container
  //     const container = brandStripRef.current
  //     if (!container) return
  //     const safeItem = item as HTMLElement
  //     const target = safeItem.offsetLeft + safeItem.offsetWidth / 2 - container.clientWidth / 2
  //     try { container.scrollTo({ left: target, behavior: 'smooth' }) } catch (e) { container.scrollLeft = target }
  //   }
  // }, [currentBrand])

  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement | null>(null)

  // Compute matching suggestions based on typed input
  // const suggestions = useMemo(() => {
  //   const trimmed = query.trim().toLowerCase()
  //   if (!trimmed) return []

  //   return products
  //     .filter((p) => {
  //       const target = `${p.name} ${p.code} ${p.category} ${p.fitment}`.toLowerCase()
  //       return target.includes(trimmed)
  //     })
  //     .slice(0, 5) // Limit to top 5 quick matches
  // }, [query])

  // Trigger navigation to search page or detail page
  const executeSearch = (searchQuery?: string) => {
    const term = (searchQuery ?? query).trim()
    setShowSuggestions(false)
    if (!term) return
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  // Close suggestion dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const PAGE_SIZE = 15
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Reset pagination whenever search query or category changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [query, activeCategory, vehicleType, vehicleModel, vehicleYear])

  // Filtered catalogue list
  const filteredProducts = useMemo(() => {
    return partStore.filter((product) => {
      // Robust category check (handles exact match or substring match like "Braking" in "Braking System")
      const matchesCategory =
        activeCategory === 'All parts' ||
        product.category.toLowerCase() === activeCategory.toLowerCase() ||
        product.category.toLowerCase().startsWith(activeCategory.toLowerCase())

      const haystack = `${product.name} ${product.category} ${product.code} ${product.sku}`.toLowerCase()
      const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase())

      const fitmentInfo = checkFitment(product, {
        make: vehicleType,
        model: vehicleModel,
        year: vehicleYear,
      })
      const matchesVehicle = fitmentInfo.status !== 'incompatible'

      return matchesCategory && matchesQuery && matchesVehicle
    })
  }, [activeCategory, query, vehicleModel, vehicleType, vehicleYear])

  // Paginated slice for the grid
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount)
  }, [filteredProducts, visibleCount])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-primary px-4 py-2 text-center text-xs font-medium tracking-wide text-primary-foreground">
        Free delivery on orders over KES 10,000 · Expert fitment support included
      </div>

      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 lg:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="Classic Auto Spares Parts home">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground"><Wrench className="size-5" /></span>
            <span className="font-mono text-lg font-bold tracking-tight">Classic Auto Spares<span className="text-accent">.</span></span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex" aria-label="Main navigation">
            <a className="text-foreground" href="#catalogue">Catalogue</a>
            <a className="hover:text-foreground" href="#categories">Categories</a>
            <a className="hover:text-foreground" href="#fitment">Find your fit</a>
            <a className="hover:text-foreground" href="/support">Support</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setEnquiryCount((count) => count + 1)} className="hidden items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:border-accent md:flex" aria-label={`Enquiry list, ${enquiryCount} items`}>
              <ShoppingBag className="size-4" /> Enquiry list {enquiryCount > 0 && <span className="flex size-5 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">{enquiryCount}</span>}
            </button>
            <button className="rounded-full border border-border p-2 md:hidden" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">
              {mobileMenu ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {mobileMenu && <nav className="flex flex-col gap-4 border-t border-border px-4 py-5 text-sm md:hidden"><a href="#catalogue">Catalogue</a><a href="#categories">Categories</a><a href="#fitment">Find your fit</a><a href="/support">Support</a></nav>}
      </header>

      <section id="top" className="w-full pb-12 pt-0 lg:pb-20">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          {/* Searchbar with Integrated Search Button & Auto-Suggestions Dropdown */}
          <div ref={searchContainerRef} className="relative flex-1">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                executeSearch()
              }}
              className="relative flex items-center"
            >
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onFocus={() => setShowSuggestions(true)}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setShowSuggestions(true)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setShowSuggestions(false)
                }}
                placeholder="Search parts, makes, models or codes"
                className="h-14 w-full rounded-3xl border-2 border-border/60 bg-card/95 pl-12 pr-28 text-sm font-medium outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-4 focus:ring-accent/30 shadow-md"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-accent-foreground transition hover:brightness-110"
              >
                Search
              </button>
            </form>

            {/* Live Auto-Suggestions Dropdown */}
            {showSuggestions && query.trim().length > 0 && (
              <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-card/95 p-2 shadow-2xl backdrop-blur">
                {suggestions.length > 0 ? (
                  <div>
                    <p className="px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Matching Parts & Codes
                    </p>
                    {suggestions.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setQuery(item.name)
                          setShowSuggestions(false)
                          router.push(`/parts/${item.slug}`)
                        }}
                        className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition hover:bg-accent/10 hover:text-accent"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{item.name}</span>
                          <span className="text-[11px] text-muted-foreground">
                            {item.compatibility?.[0] ? `${item.compatibility[0].make} ${item.compatibility[0].model}` : item.category}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-foreground">{item.price}</span>
                          <span className="block font-mono text-[10px] text-muted-foreground">{item.code}</span>
                        </div>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => executeSearch()}
                      className="mt-1 flex w-full items-center justify-center gap-1 rounded-xl border border-border/60 bg-muted/30 py-2 font-mono text-xs font-bold text-accent transition hover:bg-accent hover:text-accent-foreground"
                    >
                      See all results for "{query}" <ArrowRight className="size-3" />
                    </button>
                  </div>
                ) : (
                  <div className="px-4 py-3 text-center text-xs text-muted-foreground">
                    No exact parts found for "{query}". Press Enter to view full catalogue results.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Vehicle Selectors + Search Action Button */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:min-w-[680px]">
            {/* Make / Vehicle Type */}
            <div className="relative">
              <select
                value={vehicleType}
                onChange={(event) => setVehicleType(event.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-border bg-background px-4 pr-10 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Model */}
            <div className="relative">
              <select
                value={vehicleModel}
                onChange={(event) => setVehicleModel(event.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-border bg-background px-4 pr-10 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                {vehicleModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Year */}
            <div className="relative">
              <select
                value={vehicleYear}
                onChange={(event) => setVehicleYear(event.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-border bg-background px-4 pr-10 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                {vehicleYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Find Matching Parts Button */}
            <button
              type="button"
              onClick={() => {
                // 1. Save vehicle to global context & localStorage
                if (vehicleType && vehicleType !== 'Any vehicle') {
                  setVehicle({
                    make: vehicleType,
                    model: vehicleModel,
                    year: vehicleYear,
                  })
                } else {
                  setVehicle(null)
                }

                // 2. Build URL search params for the search page
                const params = new URLSearchParams()

                if (vehicleType && vehicleType !== 'Any vehicle') {
                  params.set('make', vehicleType)
                }
                if (vehicleModel && vehicleModel !== 'Any model') {
                  params.set('model', vehicleModel)
                }
                if (vehicleYear && vehicleYear !== 'Any year') {
                  params.set('year', vehicleYear)
                }
                if (query.trim()) {
                  params.set('q', query.trim())
                }

                const queryString = params.toString()
                router.push(`/search${queryString ? `?${queryString}` : ''}`)
              }}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 text-xs font-bold text-accent-foreground shadow-sm transition hover:brightness-110 active:scale-[0.98]"
            >
              <span>Find Parts</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="relative isolate mt-6 overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-card/80 to-card p-6 lg:p-12 shadow-2xl">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -left-20 -top-20 size-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 size-96 rounded-full bg-accent/5 blur-3xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">

            {/* Left Column: Copy & Actions (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3.5 py-1.5 text-xs font-semibold backdrop-blur">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                <span>{animatedCount}+ Parts Ready for Dispatch</span>
              </div>

              <h1 className="mt-5 font-mono text-4xl font-bold tracking-tight text-card-foreground sm:text-5xl lg:text-6xl">
                Precision Parts. <br />
                <span className="text-accent underline decoration-accent/30 decoration-wavy underline-offset-8">
                  Zero Guesswork.
                </span>
              </h1>

              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                OEM and performance aftermarket components engineered to fit your exact make, model, and year the first time.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#catalogue"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/20 transition hover:brightness-110"
                >
                  Browse Catalogue <ArrowRight className="size-4" />
                </a>
                <a
                  href="#fitment"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3.5 text-sm font-bold backdrop-blur transition hover:border-accent hover:bg-background"
                >
                  Match My Vehicle
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-border/60 pt-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">✓</span> 100% Fitment Guarantee
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">✓</span> Express Workshop Pickups
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">✓</span> Verified OEM Specs
                </div>
              </div>
            </div>

            {/* Right Column: Active Featured Part Highlight Card (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-background/50 p-5 shadow-xl backdrop-blur transition hover:border-accent/50">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-accent">
                    Featured Highlight
                  </span>
                  {/* <span className="text-xs text-muted-foreground">Updated Weekly</span> */}
                </div>

                <div className="relative my-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-muted/40">
                  <img
                    src={heroSlides[currentSlide]?.image || '/Classic Auto Spares-hero.png'}
                    alt="Featured component"
                    className="size-full object-cover object-center transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <p className="font-mono text-sm font-bold text-foreground">{heroSlides[currentSlide]?.title}</p>
                      <p className="text-xs text-muted-foreground">{heroSlides[currentSlide]?.eyebrow}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  {heroSlides[currentSlide]?.subtitle}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                  <div className="flex gap-1.5">
                    {heroSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1.5 rounded-full transition-all ${currentSlide === idx ? 'w-6 bg-accent' : 'w-2 bg-border hover:bg-muted-foreground'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={prevSlide}
                      className="flex size-8 items-center justify-center rounded-full border border-border bg-background transition hover:border-accent"
                      aria-label="Previous slide"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextSlide}
                      className="flex size-8 items-center justify-center rounded-full border border-border bg-background transition hover:border-accent"
                      aria-label="Next slide"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border bg-card/0 px-6 py-4">
            {/* Inline keyframes for the marquee animation */}
            <style>{`
    @keyframes scroll-brands {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-scroll-brands {
      animation: scroll-brands 20s linear infinite;
    }
  `}</style>

            <div className="mx-auto max-w-7xl overflow-hidden">
              <p className="mb-4 text-center text-sm font-bold text-muted-foreground">Brands we support</p>

              {/* Mask creates fading edges on the left and right */}
              <div className="group relative flex w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] py-2">

                {/* The animated track */}
                <div className="flex w-max min-w-full shrink-0 animate-scroll-brands items-center gap-8 pr-8 group-hover:[animation-play-state:paused]">

                  {/* Render the brands array TWICE to create the seamless infinite loop */}
                  {[...brands, ...brands].map((brand, idx) => {
                    const slug = brand.toLowerCase()
                    const logoSrc = `/logos/${slug}.jpg`
                    const failed = Boolean(failedLogos[slug])

                    return (
                      <div key={`${brand}-${idx}`} className="inline-flex h-28 w-28 flex-none items-center justify-center rounded-full border border-border bg-white p-3">
                        {!failed ? (
                          <img
                            src={logoSrc}
                            alt={`${brand} logo`}
                            onError={(e) => {
                              const el = e.currentTarget as HTMLImageElement
                              if (el.src.endsWith('.png')) {
                                el.src = `/logos/${slug}.svg`
                              } else {
                                setFailedLogos((prev) => ({ ...prev, [slug]: true }))
                              }
                            }}
                            className="h-20 w-20 rounded-full bg-white object-contain"
                          />
                        ) : (
                          <img src="/placeholder-logo.png" alt={`${brand} placeholder`} className="h-20 w-20 rounded-full bg-white object-contain" />
                        )}
                      </div>
                    )
                  })}

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Shop by system</p>
            <h2 className="mt-2 font-mono text-2xl font-bold tracking-tight">Start with a category</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowAllCategories((current) => !current)}
            className="flex cursor-pointer items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            {showAllCategories ? 'Show less' : 'View more'} <ArrowRight className={`size-4 transition ${showAllCategories ? 'rotate-90' : ''}`} />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {(showAllCategories ? categories : categories.slice(0, 5)).map((category) => (
            <button
              key={category.name}
              type="button"
              onClick={() => router.push(`/categories/${category.slug}`)}
              className={`group flex min-h-24 cursor-pointer items-center justify-between rounded-2xl border px-5 py-4 text-left transition hover:-translate-y-1 hover:border-accent hover:shadow-sm ${activeCategory === category.name ? 'border-accent bg-accent text-black shadow-sm' : 'border-border bg-card text-foreground hover:bg-accent/90 hover:text-black'}`}
            >
              <span>
                <span className={`block text-sm font-semibold ${activeCategory === category.name ? 'text-black' : 'text-foreground'}`}>{category.name}</span>
                <span className={`mt-1 block text-xs ${activeCategory === category.name ? 'text-black/70' : 'text-muted-foreground'}`}>{category.count} products</span>
              </span>
              <span className={`text-sm font-medium transition group-hover:translate-x-1 ${activeCategory === category.name ? 'text-black' : 'text-accent'}`}>→</span>
            </button>
          ))}
        </div>
      </section>

      <section id="catalogue" className="border-y border-border bg-muted/30 px-4 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          {/* Header & Integrated Live Search Input */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">The catalogue</p>
              <h2 className="mt-2 font-mono text-3xl font-bold tracking-tight">Built for the road ahead</h2>
            </div>
            <div className="flex w-full max-w-xl items-center gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Filter by part, code, or model..."
                  className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-10 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground hover:text-foreground"
                    aria-label="Clear filter"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                className="flex size-12 items-center justify-center rounded-xl border border-border bg-background transition hover:border-accent"
                aria-label="Filter catalogue"
              >
                <SlidersHorizontal className="size-4" />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Product categories">
            <button
              type="button"
              onClick={() => setActiveCategory('All parts')}
              className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${activeCategory === 'All parts'
                  ? 'bg-accent text-black shadow-sm'
                  : 'border border-border bg-background text-muted-foreground hover:text-foreground'
                }`}
            >
              All parts
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={() => setActiveCategory(category.name)}
                className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${activeCategory === category.name
                    ? 'bg-accent text-black shadow-sm'
                    : 'border border-border bg-background text-muted-foreground hover:text-foreground'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Result Counts */}
          <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{visibleProducts.length}</strong> of{' '}
              <strong className="text-foreground">{filteredProducts.length}</strong> parts
            </span>
            <button className="flex items-center gap-2 font-medium hover:text-foreground">
              Sort: Featured <ChevronDown className="size-4" />
            </button>
          </div>

          {/* Product Cards Grid */}
          {visibleProducts.length > 0 ? (
            <>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleProducts.map((product) => {
                  const fitment = checkFitment(product, {
                    make: vehicleType,
                    model: vehicleModel,
                    year: vehicleYear,
                  })

                  return (
                    <Link
                      key={product.sku}
                      href={`/parts/${product.slug}`}
                      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div>
                        <div className="relative h-52 overflow-hidden bg-muted">
                          <img
                            src={product.image || '/Classic Auto Spares-hero.png'}
                            alt={product.name}
                            className="size-full object-cover object-right opacity-75 grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                          />
                          {product.tag && (
                            <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                              {product.tag}
                            </span>
                          )}
                        </div>

                        <div className="p-5 pb-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                {product.category}
                              </p>
                              <h3 className="mt-1 font-mono text-lg font-bold">{product.name}</h3>
                            </div>
                            <p className="font-mono text-lg font-bold">KES {product.price.toLocaleString()}</p>
                          </div>

                          {/* Dynamic Fitment Tag */}
                          <div className="mt-3">
                            {fitment.status === 'exact-match' && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-400">
                                ✓ {fitment.label}
                              </span>
                            )}
                            {fitment.status === 'universal' && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                                Universal Fitment
                              </span>
                            )}
                          </div>

                          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                            {product.compatibility?.map((c) => `${c.make} ${c.model}`).join(' · ') || 'Universal Fitment'}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 pt-4">
                        <div className="flex items-center justify-between border-t border-border pt-4">
                          <span className="font-mono text-xs text-muted-foreground">{product.code}</span>
                          <span className="inline-flex items-center gap-2 text-sm font-bold text-accent group-hover:underline">
                            View part <ArrowRight className="size-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Incremental Load More Action */}
              {visibleCount < filteredProducts.length && (
                <div className="mt-10 flex flex-col items-center justify-center gap-2 border-t border-border/60 pt-8">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-8 py-3.5 text-sm font-bold text-foreground transition hover:border-accent hover:bg-card hover:shadow-md"
                  >
                    View more parts (+{Math.min(PAGE_SIZE, filteredProducts.length - visibleCount)})
                    <ChevronDown className="size-4" />
                  </button>
                  <span className="text-xs text-muted-foreground">
                    {filteredProducts.length - visibleCount} more items available
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
              <Search className="size-8 text-muted-foreground" />
              <h3 className="mt-4 font-mono text-lg font-bold">No parts found</h3>
              <p className="mt-2 text-sm text-muted-foreground">Try a different search term or clear the active category.</p>
              <button
                onClick={() => {
                  setQuery('')
                  setActiveCategory('All parts')
                }}
                className="mt-5 text-sm font-bold text-accent hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>
      <section id="fitment" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="flex flex-col justify-between gap-8 rounded-3xl border border-border bg-card p-8 sm:p-12 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Not sure what fits?</p>
            <h2 className="mt-3 font-mono text-3xl font-bold tracking-tight sm:text-4xl">Tell us what you drive.</h2>
            <p className="mt-4 leading-7 text-muted-foreground">Share your make, model and year. Our parts team will match you with the right options before you order.</p>
            <button
              type="button"
              onClick={() => setIsFitmentModalOpen(true)}
              className="mt-6 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
            >
              Get fitment help <ArrowRight className="size-4" />
            </button>
          </div>

          <div className="w-full max-w-lg rounded-3xl border border-border bg-background/80 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Need a part?</p>
                <h3 className="mt-1 font-mono text-xl font-bold tracking-tight">Describe the problem</h3>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                <MessageCircle className="size-3" /> WhatsApp
              </span>
            </div>

            <label className="block text-sm font-medium text-foreground">
              Your name
              <input
                value={helpForm.name}
                onChange={(event) => setHelpForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Jane Doe"
                className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </label>

            <label className="mt-4 block text-sm font-medium text-foreground">
              Vehicle details
              <input
                value={helpForm.vehicle}
                onChange={(event) => setHelpForm((current) => ({ ...current, vehicle: event.target.value }))}
                placeholder="BMW 3 Series 2019"
                className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </label>

            <label className="mt-4 block text-sm font-medium text-foreground">
              Describe the issue
              <textarea
                value={helpForm.issue}
                onChange={(event) => setHelpForm((current) => ({ ...current, issue: event.target.value }))}
                placeholder="I need a replacement headlight for the driver side..."
                rows={4}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </label>

            <a
              href={whatsappHelpLink}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-1"
            >
              <MessageCircle className="size-4" /> Send to WhatsApp
            </a>
          </div>
        </div>
      </section>

      {isFitmentModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Fitment help</p>
                <h3 className="mt-2 font-mono text-2xl font-bold tracking-tight">Tell us about your vehicle</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFitmentModalOpen(false)}
                aria-label="Close fitment help form"
                className="rounded-full border border-border bg-background p-2 text-muted-foreground transition hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-foreground">
                Your name
                <input
                  value={helpForm.name}
                  onChange={(event) => setHelpForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Jane Doe"
                  className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label className="block text-sm font-medium text-foreground">
                Car details
                <input
                  value={helpForm.vehicle}
                  onChange={(event) => setHelpForm((current) => ({ ...current, vehicle: event.target.value }))}
                  placeholder="Toyota Corolla 2019 • 1.6L petrol"
                  className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label className="block text-sm font-medium text-foreground">
                Additional information
                <textarea
                  value={helpForm.issue}
                  onChange={(event) => setHelpForm((current) => ({ ...current, issue: event.target.value }))}
                  placeholder="I need a matching front brake pad set and I'm not sure which fitment is correct."
                  rows={5}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => {
                const safeMessage = whatsappHelpLink
                setIsFitmentModalOpen(false)
                window.open(safeMessage, '_blank', 'noopener,noreferrer')
              }}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-1"
            >
              <MessageCircle className="size-4" /> Send to WhatsApp
            </button>
          </div>
        </div>
      )}

      <section id="location" className="px-0 pb-8">
        <div className="relative overflow-hidden border-y border-border bg-card">
          <div className="absolute inset-0">
            <iframe
              title="Classic Auto Spares Parts location"
              src="https://www.google.com/maps?q=Nairobi%2C%20Kenya&output=embed"
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
                <p>Nairobi, Nairobi County</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer id="support" className="border-t border-border px-4 py-8 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center"><p className="font-mono font-bold text-foreground">Classic Auto Spares<span className="text-accent">.</span></p><p>Reliable parts. Clear advice. Better drives.</p><a href="/support" className="flex items-center gap-2 hover:text-foreground"><CircleHelp className="size-4" /> Questions? Talk to us</a></div></footer>

      <a href="https://wa.me/15551234567?text=Hello%2C%20I%20need%20help%20finding%20the%20right%20car%20part." target="_blank" rel="noreferrer" className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-emerald-400/40 bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(16,185,129,0.35)] transition hover:-translate-y-1">
        <span className="relative flex size-3.5 items-center justify-center">
          <span className="absolute inline-flex size-full animate-breathe-dot rounded-full bg-emerald-200/80" />
          <span className="relative size-2.5 rounded-full bg-white" />
        </span>
        <MessageCircle className="size-4" />
        Chat on WhatsApp
      </a>
    </main>
  )
}
