'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ChevronUp, MessageCircle, ShoppingBag, X } from 'lucide-react'
import { buildInquiryUrl, getStoredCart, removeFromCart, type CartItem } from '@/lib/cart'

export function FloatingCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const syncCart = () => setItems(getStoredCart())

  useEffect(() => {
    syncCart()

    const handleStorage = () => syncCart()
    window.addEventListener('storage', handleStorage)

    const handleScroll = () => setShowScrollTop(window.scrollY > 240)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  )

  const handleRemove = (slug: string) => {
    const next = removeFromCart(slug)
    setItems(next)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {itemCount > 0 && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-black px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5"
          aria-label={`Open cart with ${itemCount} items`}
        >
          <span className="relative flex items-center justify-center rounded-full bg-white/10 p-1.5">
            <ShoppingBag className="size-4" />
          </span>
          <span className="hidden sm:inline">Cart</span>
          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-bold text-black">
            {itemCount}
          </span>
        </button>
      )}

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 inline-flex items-center justify-center rounded-full border border-border bg-black p-3 text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5"
          aria-label="Scroll to top"
        >
          <ChevronUp className="size-4" />
        </button>
      )}

      {isOpen && itemCount > 0 && (
        <div className="fixed inset-0 z-[60] flex items-end justify-end bg-background/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[2rem] border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Cart</p>
                <h3 className="mt-1 font-mono text-lg font-bold">{itemCount} item{itemCount > 1 ? 's' : ''}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground"
                aria-label="Close cart"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[50vh] space-y-3 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <div key={item.slug} className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 p-3">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="size-14 rounded-xl object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">{item.code}</p>
                    <p className="mt-1 font-mono text-xs font-bold text-foreground">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.slug)}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-5 py-4">
              <a
                href={buildInquiryUrl(items)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-bold text-accent-foreground transition hover:brightness-110"
              >
                <MessageCircle className="size-4" /> Send cart to WhatsApp
              </a>
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:border-accent"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
