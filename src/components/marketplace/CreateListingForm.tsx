'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createListing } from '@/app/(authenticated)/marketplace/actions'
import { useFormStatus } from 'react-dom'
import { ListingCategory, ListingCondition } from '@/types/marketplace'
import { X } from 'lucide-react'

// Submit button component to handle pending state
function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Creating Listing...' : 'Create Listing'}
        </Button>
    )
}

export function CreateListingForm() {
    const router = useRouter()
    const [images, setImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length + images.length > 5) {
            setError('You can only upload up to 5 images')
            return
        }
        setError(null)

        const newImages = [...images, ...files]
        setImages(newImages)

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file))
        setImagePreviews([...imagePreviews, ...newPreviews])
    }

    const removeImage = (index: number) => {
        const newImages = [...images]
        newImages.splice(index, 1)
        setImages(newImages)

        // Revoke URL to avoid memory leaks
        URL.revokeObjectURL(imagePreviews[index])

        const newPreviews = [...imagePreviews]
        newPreviews.splice(index, 1)
        setImagePreviews(newPreviews)
    }

    // We need to wrap the server action to handle the preventDefault and FormData construction manually if needed,
    // OR just use the action attribute on the form and handle the complex image state.
    // Since 'images' state is separate from the file input (which is cleared or multiple added in steps),
    // we might need to manually append them to FormData.

    const handleSubmit = async (formData: FormData) => {
        // Append images from state explicitly
        // Note: formData already has 'images' from the input if user just selected them,
        // BUT we are managing a custom list of files with removals. 
        // The file input value is not easily synced with our 'images' array state (especially after removals).
        // So usually we clear the 'images' in FormData and re-append from our state.

        formData.delete('images')
        images.forEach(image => {
            formData.append('images', image)
        })

        const result = await createListing(null, formData)

        if (result?.error) {
            setError(result.error)
        }
        // Success redirect is handled in the server action
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Sell Equipment</CardTitle>
                <CardDescription>
                    List your tennis gear for sale to the community.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="e.g. Wilson Pro Staff 97" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="0.00" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location (Optional)</Label>
                            <Input id="location" name="location" placeholder="e.g. New York, NY" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select name="category" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="racquet">Racquet</SelectItem>
                                    <SelectItem value="shoes">Shoes</SelectItem>
                                    <SelectItem value="bag">Bag</SelectItem>
                                    <SelectItem value="apparel">Apparel</SelectItem>
                                    <SelectItem value="accessories">Accessories</SelectItem>
                                    <SelectItem value="balls">Balls</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="condition">Condition</Label>
                            <Select name="condition" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="like_new">Like New</SelectItem>
                                    <SelectItem value="good">Good</SelectItem>
                                    <SelectItem value="fair">Fair</SelectItem>
                                    <SelectItem value="poor">Poor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe the item condition, specs, etc."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Images (Max 5)</Label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-2">
                            {imagePreviews.map((src, index) => (
                                <div key={index} className="relative aspect-square rounded-md overflow-hidden border bg-gray-100">
                                    <Image src={src} alt="Preview" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            {images.length < 5 && (
                                <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-md aspect-square cursor-pointer hover:bg-gray-50 border-gray-300">
                                    <span className="text-2xl text-gray-400">+</span>
                                    <span className="text-xs text-gray-500">Add Photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
    )
}
