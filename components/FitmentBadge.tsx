// components/FitmentBadge.tsx
import { CheckCircle2, XCircle } from 'lucide-react'
import { FitmentResult } from '@/lib/fitment-checker'

export function FitmentBadge({ status, label }: { status: FitmentResult['status']; label: string }) {
  if (status === 'exact-match') {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-bold text-emerald-400">
        <CheckCircle2 className="size-3.5" />
        <span>{label}</span>
      </div>
    )
  }

  if (status === 'incompatible') {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-xs font-bold text-red-400">
        <XCircle className="size-3.5" />
        <span>{label}</span>
      </div>
    )
  }

  return null
}