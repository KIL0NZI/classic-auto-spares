// lib/fitment.ts (or wherever your utility lives)
import type { PartStoreItem } from '@/lib/store.ts' // adjust path to where store.ts is located

export type SelectedVehicle = {
  make?: string
  model?: string
  year?: string
}

export type FitmentResult = {
  status: 'exact-match' | 'universal' | 'incompatible' | 'not-selected'
  label: string
}

export function checkFitment(
  product: PartStoreItem,
  vehicle: SelectedVehicle | null
): FitmentResult {
  if (!vehicle || !vehicle.make || vehicle.make === 'Any vehicle') {
    return { status: 'not-selected', label: 'Select vehicle to check fitment' }
  }

  if (product.universalFit) {
    return { status: 'universal', label: 'Universal Fitment' }
  }

  const selectedYear = vehicle.year && vehicle.year !== 'Any year' 
    ? parseInt(vehicle.year, 10) 
    : null

  const isMatch = product.compatibility.some((rule) => {
    const makeMatch = rule.make.toLowerCase() === vehicle.make?.toLowerCase()
    const modelMatch =
      !vehicle.model ||
      vehicle.model === 'Any model' ||
      rule.model.toLowerCase() === vehicle.model.toLowerCase()

    const yearMatch =
      !selectedYear ||
      ((!rule.yearFrom || selectedYear >= rule.yearFrom) &&
       (!rule.yearTo || selectedYear <= rule.yearTo))

    return makeMatch && modelMatch && yearMatch
  })

  if (isMatch) {
    const vehicleName = `${vehicle.year && vehicle.year !== 'Any year' ? vehicle.year : ''} ${vehicle.make} ${vehicle.model && vehicle.model !== 'Any model' ? vehicle.model : ''}`.trim()
    return {
      status: 'exact-match',
      label: `Guaranteed Fit for ${vehicleName}`,
    }
  }

  const vehicleName = `${vehicle.year && vehicle.year !== 'Any year' ? vehicle.year : ''} ${vehicle.make} ${vehicle.model && vehicle.model !== 'Any model' ? vehicle.model : ''}`.trim()
  return {
    status: 'incompatible',
    label: `Does not fit ${vehicleName}`,
  }
}