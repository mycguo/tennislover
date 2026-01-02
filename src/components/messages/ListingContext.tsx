import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'

interface ListingContextProps {
  listing: {
    id: string
    title: string
    price: number
    images: string[]
    category: string
  }
}

export function ListingContext({ listing }: ListingContextProps) {
  return (
    <Card className="m-4 mb-0">
      <CardContent className="p-3">
        <Link
          href={`/marketplace/${listing.id}`}
          className="flex gap-3 hover:bg-accent rounded-lg p-2 -m-2 transition-colors"
        >
          {listing.images?.[0] && (
            <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
              <Image
                src={listing.images[0]}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-sm truncate">{listing.title}</p>
                <p className="text-sm text-primary font-semibold">${listing.price}</p>
                <p className="text-xs text-muted-foreground capitalize">{listing.category}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
