import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Eye, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import VoteButtons from '@/components/posts/VoteButtons'
import SocialShare from '@/components/posts/SocialShare'
import CommentSection from '@/components/posts/CommentSection'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export async function generateMetadata({
    params,
}: {
    params: { postId: string }
}): Promise<Metadata> {
    const supabase = await createClient()

    // Fetch post for metadata (Next.js dedupes this request if it matches the page fetch?)
    // Actually, with Supabase caching might not be automatic unless using unstable_cache
    // But for metadata it's fine to fetch again or use cache.
    const { data: post } = await supabase
        .from('posts')
        .select(`
            title, 
            content, 
            images:post_images(storage_path, display_order)
        `)
        .eq('id', params.postId)
        .single()

    if (!post) {
        return {
            title: 'Post Not Found',
        }
    }

    const firstImage = (post.images || []).sort((a: any, b: any) => a.display_order - b.display_order)[0]
    const imageUrl = firstImage
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-images/${firstImage.storage_path}`
        : undefined

    return {
        title: `${post.title} | TennisLover`,
        description: post.content.substring(0, 160) + '...',
        openGraph: {
            title: post.title,
            description: post.content.substring(0, 160) + '...',
            images: imageUrl ? [imageUrl] : [],
            type: 'article',
        },
    }
}

export default async function PostDetailPage({
    params,
}: {
    params: { postId: string }
}) {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch post with all related data
    const { data: post, error } = await supabase
        .from('posts')
        .select(`
      *,
      author:users(id, full_name, alias, avatar_url, skill_level),
      images:post_images(id, storage_path, display_order, caption),
      label_assignments:post_label_assignments(
        label:labels(id, name, color)
      )
    `)
        .eq('id', params.postId)
        .single()

    if (error || !post) {
        notFound()
    }

    // Get user's vote if logged in
    let userVote = null
    if (user) {
        const { data: voteData } = await supabase
            .from('post_votes')
            .select('vote_type')
            .eq('post_id', params.postId)
            .eq('user_id', user.id)
            .single()

        userVote = voteData?.vote_type || null
    }

    // Increment view count
    await supabase
        .from('posts')
        .update({ view_count: (post.view_count || 0) + 1 })
        .eq('id', params.postId)

    // Sort images by display order
    const sortedImages = (post.images || []).sort(
        (a: any, b: any) => a.display_order - b.display_order
    )

    // Extract labels
    const labels = (post.label_assignments || []).map((la: any) => la.label)

    // Construct full URL for sharing
    const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/feed/${params.postId}`

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Button asChild variant="ghost" className="mb-4">
                <Link href="/feed">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Feed
                </Link>
            </Button>

            <Card>
                <CardContent className="p-6">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-lg font-medium">
                                    {(post.author?.alias || post.author?.full_name)?.[0] || 'U'}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium">
                                    {post.author?.alias || post.author?.full_name || 'Unknown'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(post.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                        <Badge variant="secondary">{post.category}</Badge>
                    </div>

                    {/* Labels */}
                    {labels.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {labels.map((label: any) => (
                                <span
                                    key={label.id}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
                                    style={{ backgroundColor: label.color }}
                                >
                                    {label.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

                    {/* Images */}
                    {sortedImages.length > 0 && (
                        <div className="mb-6">
                            {sortedImages.length === 1 ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-images/${sortedImages[0].storage_path}`}
                                    alt={sortedImages[0].caption || 'Post image'}
                                    className="w-full rounded-lg"
                                />
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {sortedImages.map((img: any) => (
                                        <img
                                            key={img.id}
                                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-images/${img.storage_path}`}
                                            alt={img.caption || 'Post image'}
                                            className="w-full rounded-lg"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose max-w-none mb-6">
                        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center justify-between py-4 border-t border-b">
                        <div className="flex items-center gap-6">
                            <VoteButtons
                                targetId={post.id}
                                targetType="post"
                                initialScore={post.vote_score || 0}
                                initialUserVote={userVote}
                                userId={user?.id}
                                authorId={post.author_id}
                            />
                            <div className="flex items-center gap-2 text-gray-600">
                                <Eye className="w-4 h-4" />
                                <span className="text-sm">{post.view_count || 0}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-sm">{post.comment_count || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Social Share */}
                    <div className="py-4 border-b">
                        <SocialShare
                            postId={post.id}
                            postTitle={post.title}
                            postUrl={postUrl}
                            shareCount={post.share_count || 0}
                        />
                    </div>

                    {/* Comments */}
                    <div className="mt-6">
                        <CommentSection postId={post.id} userId={user?.id} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
