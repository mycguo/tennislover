'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadImage, deleteImage } from '@/lib/supabase-storage'

interface UploadedImageData {
    path: string
    url: string
    file?: File
}

interface ImageUploadProps {
    images: UploadedImageData[]
    onImagesChange: (images: UploadedImageData[]) => void
    maxImages?: number
    userId: string
}

export default function ImageUpload({
    images,
    onImagesChange,
    maxImages = 5,
    userId,
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    const handleFiles = useCallback(
        async (files: FileList | null) => {
            if (!files || files.length === 0) return

            const remainingSlots = maxImages - images.length
            if (remainingSlots <= 0) {
                alert(`Maximum ${maxImages} images allowed`)
                return
            }

            const filesToUpload = Array.from(files).slice(0, remainingSlots)
            setUploading(true)

            try {
                const uploadPromises = filesToUpload.map(file => uploadImage(file, userId))
                const uploadedImages = await Promise.all(uploadPromises)
                onImagesChange([...images, ...uploadedImages])
            } catch (error) {
                console.error('Upload error:', error)
                alert(error instanceof Error ? error.message : 'Failed to upload images')
            } finally {
                setUploading(false)
            }
        },
        [images, maxImages, userId, onImagesChange]
    )

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(false)
            handleFiles(e.dataTransfer.files)
        },
        [handleFiles]
    )

    const handleRemove = async (index: number) => {
        const imageToRemove = images[index]

        try {
            // Delete from storage if it was uploaded
            if (imageToRemove.path) {
                await deleteImage(imageToRemove.path)
            }

            const newImages = images.filter((_, i) => i !== index)
            onImagesChange(newImages)
        } catch (error) {
            console.error('Delete error:', error)
            alert('Failed to delete image')
        }
    }

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            {images.length < maxImages && (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                >
                    <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        multiple
                        onChange={(e) => handleFiles(e.target.files)}
                        disabled={uploading}
                    />
                    <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center"
                    >
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                            {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500">
                            PNG, JPG, GIF, WebP up to 5MB ({images.length}/{maxImages} images)
                        </p>
                    </label>
                </div>
            )}

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={image.url}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
