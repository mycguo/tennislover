import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EquipmentListing } from '@/types/marketplace'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'

interface ListingCardProps {
    listing: EquipmentListing
}

export function ListingCard({ listing }: ListingCardProps) {
    const mainImage = listing.images && listing.images.length > 0
        ? listing.images[0]
        : '/placeholder-equipment.jpg' // Fallback image needed? Or check if I can generate one or use a color.

    return (
        <Link href={`/marketplace/${listing.id}`}>
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col">
                <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800">
                    {listing.images && listing.images.length > 0 ? (
                        <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-4xl">
                            🎾
                        </div>
                    )}
                    <Badge className="absolute top-2 right-2 bg-white/90 text-black hover:bg-white/100">
                        {listing.condition.replace('_', ' ')}
                    </Badge>
                </div>

                <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{listing.category}</p>
                        </div>
                        <p className="font-bold text-lg text-primary">
                            ${listing.price}
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="p-4 pt-0 flex-grow">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {listing.description}
                    </p>
                </CardContent>

                <CardFooter className="p-4 border-t flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={listing.profiles?.avatar_url} />
                            <AvatarFallback>{listing.profiles?.full_name?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                            {listing.profiles?.full_name || 'Unknown Seller'}
                        </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
                    </span>
                </CardFooter>
            </Card>
        </Link>
    )
}
