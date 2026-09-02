export type Category = {
  slug: string
  name: string
  icon: string
  count: number
  description: string
  accent: string
  subcategories?: string[]
}

export type VehicleType = {
  slug: string
  name: string
  description: string
  models: string[]
}

import { normalizePartCategory, partStore } from '@/lib/store'

export type Product = {
  slug: string
  name: string
  code: string
  categorySlug: string
  price: string
  fitment: string
  tag: string
  image: string
  images: string[]
  description: string
  highlights: string[]
  relatedSlugs: string[]
}

export const categories: Category[] = [
  { slug: 'braking', name: 'Braking', icon: '◒', count: 42, description: 'High-performance brake kits, pads and rotors for confident stopping.', accent: 'Braking systems', subcategories: ['Disc brakes', 'Pads', 'Calipers'] },
  { slug: 'engine', name: 'Engine', icon: '◈', count: 86, description: 'Air intake, cooling and engine components built for reliable power.', accent: 'Engine performance', subcategories: ['Filters', 'Cooling', 'Timing'] },
  { slug: 'suspension', name: 'Suspension', icon: '⌁', count: 31, description: 'Control arms, shocks and coilovers for sharper handling and comfort.', accent: 'Ride control', subcategories: ['Springs', 'Shocks', 'Bushings'] },
  { slug: 'electrical', name: 'Electrical', icon: 'ϟ', count: 54, description: 'Lighting, sensors and electrical upgrades for modern vehicles.', accent: 'Electrical systems', subcategories: ['Batteries', 'Sensors', 'Wiring'] },
  { slug: 'body-and-exterior', name: 'Body & Exterior', icon: '◇', count: 28, description: 'Exterior trims, mirrors and finishing parts that refresh the look.', accent: 'Exterior styling', subcategories: ['Panels', 'Trim', 'Glass'] },
  { slug: 'lighting', name: 'Lighting', icon: '☼', count: 18, description: 'Headlights, bulbs and LED upgrades for better visibility and style.', accent: 'Lighting systems', subcategories: ['Headlights', 'Bulbs', 'LEDs'] },
  { slug: 'cooling', name: 'Cooling', icon: '❄', count: 15, description: 'Radiators, fans and cooling components that keep the engine in range.', accent: 'Cooling systems', subcategories: ['Radiators', 'Fans', 'Thermostats'] },
  { slug: 'mirror', name: 'Mirror', icon: '◌', count: 9, description: 'Mirror caps and glass parts that refresh the exterior finish.', accent: 'Mirror upgrades', subcategories: ['Mirror caps', 'Glass', 'Housing'] },
  { slug: 'accessory', name: 'Accessory', icon: '✧', count: 23, description: 'Practical interior and exterior accessories to complete the build.', accent: 'Everyday upgrades', subcategories: ['Interior', 'Exterior', 'Tools'] },
]

export const vehicleTypes: VehicleType[] = [
  { slug: 'bmw', name: 'BMW', description: 'Performance parts for BMW sedans, coupes and SUVs.', models: ['3 Series', '5 Series', 'X5'] },
  { slug: 'audi', name: 'Audi', description: 'Premium fitment options for Audi A and Q line vehicles.', models: ['A4', 'A6', 'Q5'] },
  { slug: 'vw', name: 'VW', description: 'Practical upgrades and replacements for VW hatchbacks and GTIs.', models: ['Golf GTI', 'Passat', 'Touareg'] },
  { slug: 'mercedes', name: 'Mercedes', description: 'Luxury-grade fitment pieces for Mercedes-Benz models.', models: ['C-Class', 'E-Class', 'GLC'] },
  { slug: 'subaru', name: 'Subaru', description: 'Performance and reliability parts for WRX and other Subaru models.', models: ['WRX', 'Impreza', 'Outback'] },
  { slug: 'porsche', name: 'Porsche', description: 'Precision components for Porsche drivers who demand the best.', models: ['911', 'Cayenne', 'Boxster'] },
]

const slugifyCategory = (category: string) => {
  const normalized = normalizePartCategory(category)

  const map: Record<string, string> = {
    Braking: 'braking',
    Engine: 'engine',
    Suspension: 'suspension',
    Electrical: 'electrical',
    'Body & Exterior': 'body-and-exterior',
    Lighting: 'lighting',
    Cooling: 'cooling',
    Mirror: 'mirror',
    Accessory: 'accessory',
  }

  return map[normalized] ?? normalized.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

const formatPrice = (price: number) => `$${price.toLocaleString('en-US')}`

const buildFitmentText = (compatibility: { make: string; model: string; yearFrom?: number; yearTo?: number }[]) => {
  if (!compatibility.length) return 'Universal Fitment'

  return compatibility
    .slice(0, 2)
    .map((item) => {
      const years = item.yearFrom && item.yearTo ? ` · ${item.yearFrom}–${item.yearTo}` : ''
      return `${item.make} ${item.model}${years}`
    })
    .join(' • ')
}

export const products: Product[] = partStore.map((part) => ({
  slug: part.slug,
  name: part.name,
  code: part.code,
  categorySlug: slugifyCategory(part.category),
  price: formatPrice(part.price),
  fitment: buildFitmentText(part.compatibility),
  tag: part.tag ?? (part.stock_quantity > 0 ? 'In stock' : 'Limited'),
  image: part.image ?? '/Classic Auto Spares-hero.png',
  images: part.images && part.images.length ? part.images : [part.image ?? '/Classic Auto Spares-hero.png'],
  description:
    part.description ??
    'A reliable replacement part selected for fitment, quality, and long-term performance.',
  highlights:
    part.highlights && part.highlights.length
      ? part.highlights
      : ['Quality-fit component', 'Built for dependable performance', 'Compatible with listed vehicle fitments'],
  relatedSlugs: part.relatedSlugs ?? [],
}))

export const vehicleModels = ['Any model', '3 Series', 'A4', 'Golf GTI', 'C-Class', 'WRX', '911']
export const vehicleYears = ['Any year', '2012', '2013', '2014', '2015', '2017', '2019', '2020', '2021']

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug)
}

export function getVehicleTypeBySlug(slug: string) {
  return vehicleTypes.find((vehicle) => vehicle.slug === slug)
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug)
}

export function getProductsForCategory(categorySlug: string) {
  return products.filter((product) => product.categorySlug === categorySlug)
}

export function getProductsForVehicle(vehicleSlug: string) {
  return products.filter((product) => product.fitment.toLowerCase().includes(vehicleSlug.toLowerCase()))
}

export function getRelatedProducts(product: Product) {
  return products.filter((item) => product.relatedSlugs.includes(item.slug))
}
