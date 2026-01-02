'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Reply, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'

interface Comment {
    id: string
    content: string
    author_id: string
    parent_id: string | null
    created_at: string
    updated_at: string
    author?: {
        id: string
        full_name: string
        alias: string | null
        avatar_url: string | null
    }
    replies?: Comment[]
}

interface CommentSectionProps {
    postId: string
    userId?: string
}

export default function CommentSection({ postId, userId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [newComment, setNewComment] = useState('')
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editContent, setEditContent] = useState('')
    const supabase = createClient()

    useEffect(() => {
        fetchComments()
    }, [postId])

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from('comments')
            .select(`
        *,
        author:users(id, full_name, alias, avatar_url)
      `)
            .eq('post_id', postId)
            .order('created_at', { ascending: true })

        if (!error && data) {
            // Organize comments into tree structure
            const commentMap = new Map<string, Comment>()
            const rootComments: Comment[] = []

            data.forEach(comment => {
                commentMap.set(comment.id, { ...comment, replies: [] })
            })

            data.forEach(comment => {
                const commentWithReplies = commentMap.get(comment.id)!
                if (comment.parent_id) {
                    const parent = commentMap.get(comment.parent_id)
                    if (parent) {
                        parent.replies!.push(commentWithReplies)
                    }
                } else {
                    rootComments.push(commentWithReplies)
                }
            })

            // Sort root comments by newest first
            rootComments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

            setComments(rootComments)
        }
        setLoading(false)
    }

    const handleAddComment = async () => {
        if (!userId || !newComment.trim()) return

        const { error } = await supabase.from('comments').insert({
            post_id: postId,
            author_id: userId,
            content: newComment.trim(),
        })

        if (!error) {
            setNewComment('')
            fetchComments()
        } else {
            alert('Failed to add comment')
        }
    }

    const handleAddReply = async (parentId: string) => {
        if (!userId || !replyContent.trim()) return

        const { error } = await supabase.from('comments').insert({
            post_id: postId,
            author_id: userId,
            content: replyContent.trim(),
            parent_id: parentId,
        })

        if (!error) {
            setReplyContent('')
            setReplyingTo(null)
            fetchComments()
        } else {
            alert('Failed to add reply')
        }
    }

    const handleEdit = async (commentId: string) => {
        if (!editContent.trim()) return

        const { error } = await supabase
            .from('comments')
            .update({ content: editContent.trim(), updated_at: new Date().toISOString() })
            .eq('id', commentId)

        if (!error) {
            setEditingId(null)
            setEditContent('')
            fetchComments()
        } else {
            alert('Failed to edit comment')
        }
    }

    const handleDelete = async (commentId: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return

        const { error } = await supabase.from('comments').delete().eq('id', commentId)

        if (!error) {
            fetchComments()
        } else {
            alert('Failed to delete comment')
        }
    }

    const renderComment = (comment: Comment, depth = 0) => {
        const isAuthor = userId === comment.author_id
        const isEditing = editingId === comment.id
        const isReplying = replyingTo === comment.id

        return (
            <div key={comment.id} className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-4'}`}>
                <div className="flex gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">
                            {(comment.author?.alias || comment.author?.full_name)?.[0] || 'U'}
                        </span>
                    </div>

                    <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">
                                    {comment.author?.alias || comment.author?.full_name || 'Unknown'}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            {isEditing ? (
                                <div className="space-y-2">
                                    <Textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        rows={3}
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleEdit(comment.id)}>
                                            Save
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setEditingId(null)
                                                setEditContent('')
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-700">{comment.content}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-3 mt-2 text-xs">
                            {userId && !isEditing && (
                                <button
                                    onClick={() => setReplyingTo(comment.id)}
                                    className="flex items-center gap-1 text-gray-600 hover:text-green-600"
                                >
                                    <Reply className="w-3 h-3" />
                                    Reply
                                </button>
                            )}

                            {isAuthor && !isEditing && (
                                <>
                                    <button
                                        onClick={() => {
                                            setEditingId(comment.id)
                                            setEditContent(comment.content)
                                        }}
                                        className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                                    >
                                        <Edit2 className="w-3 h-3" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="flex items-center gap-1 text-gray-600 hover:text-red-600"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>

                        {isReplying && (
                            <div className="mt-3 space-y-2">
                                <Textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Write a reply..."
                                    rows={3}
                                />
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                                        Reply
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setReplyingTo(null)
                                            setReplyContent('')
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}

                        {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-2">
                                {comment.replies.map(reply => renderComment(reply, depth + 1))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Comments ({comments.length})
            </h3>

            {userId && (
                <div className="space-y-2">
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        rows={3}
                    />
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        Add Comment
                    </Button>
                </div>
            )}

            {loading ? (
                <p className="text-gray-500">Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                    No comments yet. Be the first to comment!
                </p>
            ) : (
                <div className="space-y-2">
                    {comments.map(comment => renderComment(comment))}
                </div>
            )}
        </div>
    )
}
