import { notFound } from 'next/navigation'
import { getListing } from '../actions'
import { ListingDetail } from '@/components/marketplace/ListingDetail'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props {
    params: Promise<{
        id: string
    }>
}

export default async function ListingDetailPage({ params }: Props) {
    const { id } = await params
    const listing = await getListing(id)

    if (!listing) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary" asChild>
                <Link href="/marketplace">
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back to Marketplace
                </Link>
            </Button>

            <ListingDetail listing={listing} />
        </div>
    )
}
