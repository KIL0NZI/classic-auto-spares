export type CartItem = {
  slug: string
  name: string
  code: string
  price: number
  quantity: number
  image?: string
}

const CART_STORAGE_KEY = 'classic-auto-spares-cart'

export function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(
      (item): item is CartItem =>
        !!item &&
        typeof item.slug === 'string' &&
        typeof item.name === 'string' &&
        typeof item.code === 'string' &&
        typeof item.price === 'number' &&
        typeof item.quantity === 'number'
    )
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

export function addToCart(item: CartItem) {
  const existing = getStoredCart()
  const next = [...existing]
  const index = next.findIndex((entry) => entry.slug === item.slug)

  if (index >= 0) {
    next[index] = {
      ...next[index],
      quantity: next[index].quantity + item.quantity,
      price: item.price,
    }
  } else {
    next.push(item)
  }

  saveCart(next)
  return next
}

export function removeFromCart(slug: string) {
  const next = getStoredCart().filter((item) => item.slug !== slug)
  saveCart(next)
  return next
}

export function clearCart() {
  saveCart([])
  return []
}

export function getCartTotal(items: CartItem[] = getStoredCart()) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function getCartCount(items: CartItem[] = getStoredCart()) {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function buildInquiryMessage(items: CartItem[]) {
  const safeItems = items.length ? items : []
  const productLines = safeItems.map(
    (item) => `${item.name} (${item.code}) x${item.quantity} — KES ${item.price.toLocaleString()} each`
  )

  const total = getCartTotal(safeItems)

  return [
    'Hello Classic Auto Spares Parts, I would like to inquire about the following items:',
    '',
    ...productLines,
    '',
    `Total estimated value: KES ${total.toLocaleString()}`,
    '',
    'Please confirm stock and delivery availability.',
  ].join('\n')
}

export function buildInquiryUrl(items: CartItem[] = getStoredCart()) {
  return `https://wa.me/15551234567?text=${encodeURIComponent(buildInquiryMessage(items))}`
}
