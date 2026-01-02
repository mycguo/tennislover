'use client'

import { useState } from 'react'
import Image from 'next/image'
import { EquipmentListing } from '@/types/marketplace'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin, MessageCircle, Share2, Tag, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface ListingDetailProps {
    listing: EquipmentListing
}

export function ListingDetail({ listing }: ListingDetailProps) {
    const [selectedImage, setSelectedImage] = useState(listing.images?.[0] || '/placeholder-equipment.jpg')

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-gray-100">
                    {listing.images && listing.images.length > 0 ? (
                        <Image
                            src={selectedImage}
                            alt={listing.title}
                            fill
                            className="object-contain"
                            priority
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-6xl">
                            🎾
                        </div>
                    )}
                </div>
                {listing.images && listing.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {listing.images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(img)}
                                className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${selectedImage === img ? 'border-primary' : 'border-transparent'
                                    }`}
                            >
                                <Image src={img} alt="" fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                    <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary" className="capitalize text-sm px-3 py-1">
                            {listing.category}
                        </Badge>
                        <Badge variant="secondary" className="capitalize text-sm px-3 py-1">
                            Condition: {listing.condition.replace('_', ' ')}
                        </Badge>
                        <Badge variant={listing.status === 'available' ? 'default' : 'destructive'} className="uppercase text-xs">
                            {listing.status}
                        </Badge>
                    </div>
                    <div className="text-4xl font-bold text-primary mb-1">
                        ${listing.price}
                    </div>
                    {listing.location && (
                        <div className="flex items-center text-gray-500 mt-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {listing.location}
                        </div>
                    )}
                </div>

                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h3 className="font-semibold text-lg">Description</h3>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {listing.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t">
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                Listed {formatDistanceToNow(new Date(listing.created_at))} ago
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Seller Info */}
                <Card>
                    <CardHeader className="pb-3">
                        <h3 className="font-semibold text-lg">Seller Information</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={listing.profiles?.avatar_url} />
                                <AvatarFallback>{listing.profiles?.full_name?.[0] || '?'}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-semibold text-lg">
                                    {listing.profiles?.full_name || 'Unknown User'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Member since 2026
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button className="w-full" asChild>
                                <Link href={`/messages?userId=${listing.seller_id}`}>
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Message Seller
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
