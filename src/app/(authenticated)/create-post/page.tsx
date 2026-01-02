'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/posts/ImageUpload'
import LabelSelector from '@/components/posts/LabelSelector'

interface UploadedImage {
  path: string
  url: string
}

export default function CreatePostPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'discussion' as const,
  })
  const [images, setImages] = useState<UploadedImage[]>([])
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])

  // Get user ID on mount
  useState(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUser()
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert('You must be logged in to create a post')
        return
      }

      // Create post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          author_id: user.id,
        })
        .select()
        .single()

      if (postError) throw postError

      // Add images if any
      if (images.length > 0) {
        const imageRecords = images.map((img, index) => ({
          post_id: post.id,
          storage_path: img.path,
          display_order: index,
        }))

        const { error: imagesError } = await supabase
          .from('post_images')
          .insert(imageRecords)

        if (imagesError) throw imagesError
      }

      // Add labels if any
      if (selectedLabels.length > 0) {
        const labelAssignments = selectedLabels.map(labelId => ({
          post_id: post.id,
          label_id: labelId,
        }))

        const { error: labelsError } = await supabase
          .from('post_label_assignments')
          .insert(labelAssignments)

        if (labelsError) throw labelsError
      }

      router.push('/feed')
      router.refresh()
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create a Post</CardTitle>
          <CardDescription>Share your thoughts with the tennis community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <Input
                id="title"
                type="text"
                placeholder="What's your post about?"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                maxLength={200}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Category
              </label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discussion">Discussion</SelectItem>
                  <SelectItem value="tips">Tips</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Labels (optional)
              </label>
              <LabelSelector
                selectedLabels={selectedLabels}
                onLabelsChange={setSelectedLabels}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-2">
                Content
              </label>
              <Textarea
                id="content"
                placeholder="Share your thoughts..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Images (optional)
              </label>
              <ImageUpload
                images={images}
                onImagesChange={setImages}
                userId={userId}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Creating...' : 'Create Post'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
