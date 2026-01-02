import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ListingGrid } from '@/components/marketplace/ListingGrid'
import { ListingFilters } from '@/components/marketplace/ListingFilters'
import { getListings } from './actions'
import { PlusCircle } from 'lucide-react'

// Force dynamic rendering since we depend on searchParams
export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{
    category?: string
    condition?: string
    minPrice?: string
    maxPrice?: string
  }>
}

export default async function MarketplacePage({ searchParams }: Props) {
  const params = await searchParams
  const listings = await getListings({
    category: params.category,
    condition: params.condition,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment Marketplace</h1>
          <p className="text-muted-foreground mt-1">Buy, sell, and trade tennis gear with your local community</p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/marketplace/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Sell Equipment
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <ListingFilters />
        </aside>

        <div className="lg:col-span-3">
          <Suspense fallback={<div className="text-center py-20">Loading marketplace...</div>}>
            <ListingGrid listings={listings || []} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
