'use client'

import { useState, useRef, useEffect } from 'react'
import { Car, ChevronDown, Check, X, RotateCcw } from 'lucide-react'
import { useFitment } from '@/context/FitmentContext'

const MAKES = ['Toyota', 'Subaru', 'Nissan', 'Honda', 'Mazda', 'Mitsubishi', 'Isuzu', 'BMW', 'Mercedes']

export function FloatingGarage() {
  const { vehicle, setVehicle, clearVehicle } = useFitment()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const hasVehicle = Boolean(vehicle?.make && vehicle.make !== 'Any vehicle')

  // Close popup if clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectMake = (make: string) => {
    setVehicle({
      make,
      model: vehicle?.model || 'Any model',
      year: vehicle?.year || 'Any year',
    })
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-40">
      {/* Floating Pill Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-3 rounded-full border px-4 py-2.5 shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-[1.02] ${
          hasVehicle
            ? 'border-emerald-500/40 bg-card/95 text-foreground shadow-emerald-500/10'
            : 'border-border bg-card/95 text-muted-foreground hover:border-accent hover:text-foreground'
        }`}
      >
        <span
          className={`flex size-7 items-center justify-center rounded-full ${
            hasVehicle ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted text-muted-foreground'
          }`}
        >
          <Car className="size-4" />
        </span>

        <div className="text-left">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {hasVehicle ? 'Active Vehicle' : 'No Vehicle Set'}
          </p>
          <p className="font-mono text-xs font-bold text-foreground">
            {hasVehicle ? `${vehicle?.year !== 'Any year' ? vehicle?.year : ''} ${vehicle?.make}`.trim() : 'Select Make'}
          </p>
        </div>

        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Quick Switch Popover Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-3 w-64 overflow-hidden rounded-2xl border border-border bg-card/95 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between border-b border-border/70 pb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Make
            </span>
            {hasVehicle && (
              <button
                type="button"
                onClick={() => {
                  clearVehicle()
                  setIsOpen(false)
                }}
                className="flex items-center gap-1 font-mono text-[10px] font-bold text-red-400 transition hover:underline"
              >
                <RotateCcw className="size-3" /> Clear
              </button>
            )}
          </div>

          <div className="mt-2 max-h-56 space-y-1 overflow-y-auto pr-1">
            {MAKES.map((make) => {
              const isSelected = vehicle?.make?.toLowerCase() === make.toLowerCase()
              return (
                <button
                  key={make}
                  type="button"
                  onClick={() => handleSelectMake(make)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition ${
                    isSelected
                      ? 'bg-accent font-bold text-accent-foreground'
                      : 'text-foreground hover:bg-muted/70'
                  }`}
                >
                  <span>{make}</span>
                  {isSelected && <Check className="size-3.5" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}