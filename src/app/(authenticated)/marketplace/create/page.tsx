import { CreateListingForm } from '@/components/marketplace/CreateListingForm'

export default function CreateListingPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Listing</h1>
                <p className="text-muted-foreground">
                    Fill out the details below to post your equipment for sale.
                </p>
            </div>

            <CreateListingForm />
        </div>
    )
}
