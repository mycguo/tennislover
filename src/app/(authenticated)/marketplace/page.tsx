import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function MarketplacePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Equipment Marketplace</h1>
        <Button asChild>
          <Link href="/marketplace/create">List Equipment</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">🎾</div>
          <h3 className="text-xl font-semibold mb-2">Marketplace Coming Soon</h3>
          <p className="text-gray-600 mb-4">Buy, sell, and trade tennis equipment with the community</p>
        </CardContent>
      </Card>
    </div>
  )
}
