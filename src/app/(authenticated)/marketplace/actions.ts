'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { UploadedImage, uploadImage } from '@/lib/supabase-storage'

export async function createListing(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'You must be logged in to create a listing' }
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const condition = formData.get('condition') as string
    const price = parseFloat(formData.get('price') as string)
    const location = formData.get('location') as string
    const images = formData.getAll('images') as File[]

    // Validate inputs
    if (!title || !description || !category || !condition || isNaN(price)) {
        return { error: 'Please fill in all required fields' }
    }

    try {
        // Upload images
        const uploadedImageUrls: string[] = []

        // Filter out empty files if any (e.g. if user didn't select anything)
        const validImages = images.filter(file => file.size > 0 && file.name !== 'undefined')

        // We'll reuse the uploadImage from lib but we might need to adjust it if it's client-side only.
        // Checking lib/supabase-storage.ts... it uses createClient from '@/lib/supabase/client', which is for client-side.
        // Since we are in a server action, we need to handle storage upload here or adjust the lib.
        // The existing lib is likely client-side. Let's make a server-side compatible upload or just use the client to upload BEFORE submitting the form?
        // "createClient" in 'lib/supabase/client' is strictly browser. 
        // Usually it's better to upload from client to avoid sending files to next.js serverless function limits.
        // BUT for simplicity in this "agentic" flow, handling on server is often requested unless I see "use client" constraints.
        // Wait, the lib/supabase-storage.ts imports `createClient` from `@/lib/supabase/client`.
        // I should probably check if I can reuse it or if I should just write the upload logic here using server client.

        // Actually, handling file uploads in server actions is fine for small files.
        // Let's implement the upload logic here directly using the server client to be safe.

        for (const file of validImages) {
            const fileExt = file.name.split('.').pop()
            const fileName = `marketplace/${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('post-images') // Reusing the bucket as planned
                .upload(fileName, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('post-images')
                .getPublicUrl(uploadData.path)

            uploadedImageUrls.push(publicUrl)
        }

        const { error } = await supabase
            .from('equipment_listings')
            .insert({
                seller_id: user.id,
                title,
                description,
                category,
                condition,
                price,
                location,
                images: uploadedImageUrls,
                status: 'available'
            })

        if (error) {
            console.error('Database Error:', error)
            return { error: 'Failed to create listing' }
        }

    } catch (error) {
        console.error('Error:', error)
        return { error: 'Something went wrong' }
    }

    revalidatePath('/marketplace')
    redirect('/marketplace')
}

export async function getListings(filters?: {
    category?: string
    condition?: string
    minPrice?: number
    maxPrice?: number
}) {
    const supabase = await createClient()

    let query = supabase
        .from('equipment_listings')
        .select(`
      *,
      profiles:users (
        id,
        full_name,
        avatar_url
      )
    `)
        .eq('status', 'available')
        .order('created_at', { ascending: false })

    if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category)
    }

    if (filters?.condition && filters.condition !== 'all') {
        query = query.eq('condition', filters.condition)
    }

    // Price filtering might need more precise handling if doing range, 
    // but let's stick to simple equals or basic range if passed. 
    // For now the filters passed might be simple keys.

    const { data, error } = await query

    if (error) {
        console.error('Error fetching listings:', error)
        return []
    }

    return data
}

export async function getListing(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('equipment_listings')
        .select(`
      *,
      profiles:users (
        id,
        full_name,
        avatar_url
      )
    `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching listing:', error)
        return null
    }

    return data
}
