'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input' // Assuming Input exists
import { Eye, MessageCircle, Send } from 'lucide-react'
import VoteButtons from './VoteButtons'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface PostCardProps {
    post: any // Using specific type would be better but keeping simple for now
    userId?: string
    userVote?: number | null
    initialLatestComment?: any
}

export default function PostCard({ post, userId, userVote, initialLatestComment }: PostCardProps) {
    const router = useRouter()
    const supabase = createClient()
    const [comment, setComment] = useState('')
    const [latestComment, setLatestComment] = useState(initialLatestComment)
    const [submitting, setSubmitting] = useState(false)
    const [labels] = useState(() => (post.label_assignments || []).map((la: any) => la.label))
    const [firstImage] = useState(() => (post.images || []).sort((a: any, b: any) => a.display_order - b.display_order)[0])
    const [imageCount] = useState(() => (post.images || []).length)
    const [localCommentCount, setLocalCommentCount] = useState(post.comment_count || 0)


    const handleAddComment = async () => {
        if (!userId || !comment.trim()) return

        setSubmitting(true)
        const content = comment.trim()

        try {
            const { data, error } = await supabase
                .from('comments')
                .insert({
                    post_id: post.id,
                    author_id: userId,
                    content: content
                })
                .select(`
                    id, content, created_at,
                    author:users(alias, full_name)
                `)
                .single()

            if (error) throw error

            setComment('')
            setLatestComment(data)
            setLocalCommentCount((prev: number) => prev + 1)
            router.refresh() // Refresh server components to update counts elsewhere if needed
        } catch (error) {
            console.error('Error adding comment:', error)
            alert('Failed to add comment')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm">
                                {(post.author?.alias || post.author?.full_name)?.[0] || 'U'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium">{post.author?.alias || post.author?.full_name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">
                                {new Date(post.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <Badge variant="secondary">{post.category}</Badge>
                </div>

                {/* Labels */}
                {labels.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {labels.map((label: any) => (
                            <span
                                key={label.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                                style={{ backgroundColor: label.color }}
                            >
                                {label.name}
                            </span>
                        ))}
                    </div>
                )}

                <CardTitle className="text-xl">
                    <Link href={`/feed/${post.id}`} className="hover:text-green-600">
                        {post.title}
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Image Preview */}
                {firstImage && (
                    <div className="mb-4 relative">
                        <img
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-images/${firstImage.storage_path}`}
                            alt="Post preview"
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        {imageCount > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                +{imageCount - 1} more
                            </div>
                        )}
                    </div>
                )}

                <CardDescription className="text-base line-clamp-3 mb-4">
                    {post.content}
                </CardDescription>

                {/* Stats and Actions */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 border-b pb-4">
                    <VoteButtons
                        postId={post.id}
                        initialScore={post.vote_score || 0}
                        initialUserVote={userVote}
                        userId={userId}
                        authorId={post.author_id}
                    />
                    <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.view_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{localCommentCount}</span>
                    </div>
                </div>

                {/* Latest Comment Section */}
                <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                    {latestComment ? (
                        <div className="text-sm">
                            <span className="font-semibold mr-2">
                                {latestComment.author?.alias || latestComment.author?.full_name || 'User'}:
                            </span>
                            <span className="text-gray-700">{latestComment.content}</span>
                        </div>
                    ) : (
                        <div className="text-xs text-gray-400 italic">
                            No comments yet
                        </div>
                    )}

                    {/* Add Comment Input */}
                    {userId && (
                        <div className="flex gap-2">
                            <Input
                                placeholder="Write a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="h-8 text-sm"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        handleAddComment()
                                    }
                                }}
                            />
                            <Button
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={handleAddComment}
                                disabled={submitting || !comment.trim()}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
