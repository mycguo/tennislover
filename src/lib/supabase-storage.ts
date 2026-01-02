import { createClient } from '@/lib/supabase/client'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const BUCKET_NAME = 'post-images'

export interface UploadedImage {
    path: string
    url: string
}

/**
 * Upload an image to Supabase Storage
 */
export async function uploadImage(
    file: File,
    userId: string
): Promise<UploadedImage> {
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.')
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds 5MB limit.')
    }

    const supabase = createClient()

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        })

    if (error) {
        throw new Error(`Upload failed: ${error.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path)

    return {
        path: data.path,
        url: publicUrl,
    }
}

/**
 * Upload multiple images
 */
export async function uploadImages(
    files: File[],
    userId: string
): Promise<UploadedImage[]> {
    const uploadPromises = files.map(file => uploadImage(file, userId))
    return Promise.all(uploadPromises)
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(path: string): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path])

    if (error) {
        throw new Error(`Delete failed: ${error.message}`)
    }
}

/**
 * Delete multiple images
 */
export async function deleteImages(paths: string[]): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(paths)

    if (error) {
        throw new Error(`Delete failed: ${error.message}`)
    }
}

/**
 * Get public URL for an image
 */
export function getImageUrl(path: string): string {
    const supabase = createClient()

    const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path)

    return publicUrl
}
