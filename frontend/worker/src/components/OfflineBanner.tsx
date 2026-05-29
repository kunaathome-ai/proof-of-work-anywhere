import { WifiOff } from 'lucide-react'

export default function OfflineBanner() {
  return (
    <div className="bg-orange-500 text-white px-4 py-3 flex items-center justify-center">
      <WifiOff className="w-5 h-5 mr-2" />
      <span className="text-sm font-medium">You're offline. Evidence will be cached and synced when connected.</span>
    </div>
  )
}
