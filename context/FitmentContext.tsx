'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface SelectedVehicle {
  make: string
  model: string
  year: string
}

interface FitmentContextType {
  vehicle: SelectedVehicle | null
  setVehicle: (vehicle: SelectedVehicle | null) => void
  clearVehicle: () => void
}

const FitmentContext = createContext<FitmentContextType | undefined>(undefined)

export function FitmentProvider({ children }: { children: React.ReactNode }) {
  const [vehicle, setVehicleState] = useState<SelectedVehicle | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('Classic Auto Spares_garage_vehicle')
      if (stored) {
        setVehicleState(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load saved vehicle', e)
    }
  }, [])

  const setVehicle = (veh: SelectedVehicle | null) => {
    setVehicleState(veh)
    if (veh) {
      localStorage.setItem('Classic Auto Spares_garage_vehicle', JSON.stringify(veh))
    } else {
      localStorage.removeItem('Classic Auto Spares_garage_vehicle')
    }
  }

  const clearVehicle = () => {
    setVehicleState(null)
    localStorage.removeItem('Classic Auto Spares_garage_vehicle')
  }

  return (
    <FitmentContext.Provider value={{ vehicle, setVehicle, clearVehicle }}>
      {children}
    </FitmentContext.Provider>
  )
}

export function useFitment() {
  const context = useContext(FitmentContext)
  if (!context) {
    throw new Error('useFitment must be used within a FitmentProvider')
  }
  return context
}