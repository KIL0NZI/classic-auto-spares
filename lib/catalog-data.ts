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

import { getCompatibilitySummary, getPartImages, normalizePartCategory, partStore } from '@/lib/store'

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

const slugifyVehicle = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const slugifyCategory = (category: string) =>
  category
    .trim()
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(price)

const categoryDescriptions: Record<string, string> = {
  'Brakes & Friction': 'Brake pads, linings, and friction components for reliable stopping power.',
  'Filtration & Fluids': 'Air, diesel, oils, and transmission fluid essentials for daily operation.',
  'Clutch & Transmission': 'Clutches, gears, drive controls, and transmission hardware for truck reliability.',
  'Engine & Cooling': 'Engine sleeves, cooling essentials, and heavy-duty engine support parts.',
  'Steering & Suspension': 'Suspension and steering components that keep heavy vehicles stable and aligned.',
  'Oil Seals & Rubbers': 'Seals and rubber parts built to protect critical moving assemblies.',
  Bearings: 'Wheel and shaft bearings for load support and smooth rotation.',
  'Body & Exterior': 'Exterior trim and cabin parts for repair and restoration work.',
  Electrical: 'Electrical hardware for reliable signal, power, and control systems.',
  Lighting: 'Lighting products that improve visibility and road safety.',
  Cooling: 'Cooling parts built for consistent temperature control under load.',
  Mirror: 'Rear visibility components for trucks and utility vehicles.',
  Accessory: 'Useful add-on parts and workshop accessories for regular maintenance.',
}

export const categories: Category[] = Array.from(
  new Map(
    partStore.map((part) => {
      const slug = slugifyCategory(part.category)
      return [slug, {
        slug,
        name: part.category,
        icon: '◈',
        count: 0,
        description: categoryDescriptions[part.category] ?? 'Specialist parts for dependable workshop repairs.',
        accent: 'Workshop essentials',
        subcategories: [],
      }]
    })
  ).values()
).map((category) => ({
  ...category,
  count: partStore.filter((part) => slugifyCategory(part.category) === category.slug).length,
}))

export const vehicleTypes: VehicleType[] = Array.from(
  new Set(
    partStore.flatMap((part) => [
      ...(part.compatibility?.chassis ?? []),
      ...(part.compatibility?.engine ?? []),
      ...(part.compatibility?.description ? [part.compatibility.description] : []),
    ])
  )
).filter(Boolean).map((value) => ({
  slug: slugifyVehicle(value),
  name: value,
  description: `Compatible parts and replacement components for ${value} vehicle applications.`,
  models: [value],
}))

export const CATALOG_CATEGORIES = ['All Parts', ...categories.map((category) => category.name)]

export const VEHICLE_MODELS = ['All Vehicles', ...vehicleTypes.map((vehicle) => vehicle.name)]

export const products: Product[] = partStore.map((part) => {
  const images = getPartImages(part)

  return {
    slug: part.slug,
    name: part.name,
    code: part.code,
    categorySlug: slugifyCategory(part.category),
    price: formatPrice(part.price),
    fitment: getCompatibilitySummary(part.compatibility),
    tag: part.tag ?? (part.stock_quantity > 0 ? 'In stock' : 'Limited'),
    image: images[0] ?? '/Classic Auto Spares-hero.png',
    images,
    description:
      part.description ??
      'A reliable replacement part selected for fitment, quality, and long-term performance.',
    highlights:
      part.highlights && part.highlights.length
        ? part.highlights
        : ['Quality-fit component', 'Built for dependable performance', 'Compatible with listed vehicle fitments'],
    relatedSlugs: part.relatedSlugs ?? [],
  }
})

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
  const normalizedSlug = slugifyVehicle(vehicleSlug)

  return products.filter((product) => {
    const compatibilityText = `${product.fitment} ${product.name} ${product.code}`.toLowerCase()
    return compatibilityText.includes(normalizedSlug.replace(/-/g, ' ')) || product.categorySlug.includes(normalizedSlug)
  })
}

export function getRelatedProducts(product: Product) {
  if (product.relatedSlugs.length) {
    return products.filter((item) => product.relatedSlugs.includes(item.slug))
  }

  return products.filter((item) => item.categorySlug === product.categorySlug && item.slug !== product.slug).slice(0, 4)
}
