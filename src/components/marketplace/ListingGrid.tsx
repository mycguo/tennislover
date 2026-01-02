import { EquipmentListing } from '@/types/marketplace'
import { ListingCard } from './ListingCard'

interface ListingGridProps {
    listings: EquipmentListing[]
}

export function ListingGrid({ listings }: ListingGridProps) {
    if (listings.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="text-6xl mb-4">🎾</div>
                <h3 className="text-xl font-semibold mb-2">No listings found</h3>
                <p className="text-muted-foreground">
                    Be the first to list something!
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
            ))}
        </div>
    )
}
