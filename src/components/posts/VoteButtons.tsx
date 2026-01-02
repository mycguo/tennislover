'use client'

import { useState, useEffect } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface VoteButtonsProps {
    targetId: string
    targetType?: 'post' | 'comment'
    initialScore?: number
    initialUserVote?: number | null
    userId?: string
    authorId?: string
}

export default function VoteButtons({
    targetId,
    targetType = 'post',
    initialScore = 0,
    initialUserVote = null,
    userId,
    authorId,
}: VoteButtonsProps) {
    const [score, setScore] = useState(initialScore)
    const [userVote, setUserVote] = useState<number | null>(initialUserVote)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()
    const isOwner = userId && authorId && userId === authorId

    const tableName = targetType === 'post' ? 'post_votes' : 'comment_votes'
    const idColumn = targetType === 'post' ? 'post_id' : 'comment_id'

    const handleVote = async (voteType: 1 | -1) => {
        if (!userId) {
            alert('You must be logged in to vote')
            return
        }

        if (isOwner) {
            alert(`You cannot vote on your own ${targetType}`)
            return
        }

        setLoading(true)

        try {
            // If clicking the same vote, remove it
            if (userVote === voteType) {
                const { error } = await supabase
                    .from(tableName)
                    .delete()
                    .eq(idColumn, targetId)
                    .eq('user_id', userId)

                if (error) throw error

                // Update UI optimistically
                setScore(score - voteType)
                setUserVote(null)
            } else {
                // Insert or update vote
                // We construct the object dynamically or use explicit mapping
                const voteData = {
                    [idColumn]: targetId,
                    user_id: userId,
                    vote_type: voteType,
                    updated_at: new Date().toISOString(),
                }

                const { error } = await supabase
                    .from(tableName)
                    .upsert(
                        voteData,
                        {
                            onConflict: `${idColumn},user_id`,
                        }
                    )

                if (error) throw error

                // Update UI optimistically
                const scoreDelta = userVote === null ? voteType : voteType - userVote
                setScore(score + scoreDelta)
                setUserVote(voteType)
            }
        } catch (error) {
            console.error('Vote error:', error)
            alert('Failed to vote. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(1)}
                disabled={loading || !userId || !!isOwner}
                className={`p-1 h-8 w-8 ${userVote === 1 ? 'text-green-600 bg-green-50' : 'text-gray-600'
                    } ${isOwner ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isOwner ? `You cannot vote on your own ${targetType}` : "Upvote"}
            >
                <ArrowUp className="w-4 h-4" />
            </Button>

            <span
                className={`text-sm font-semibold min-w-[2rem] text-center ${score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}
            >
                {score}
            </span>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(-1)}
                disabled={loading || !userId || !!isOwner}
                className={`p-1 h-8 w-8 ${userVote === -1 ? 'text-red-600 bg-red-50' : 'text-gray-600'
                    } ${isOwner ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isOwner ? `You cannot vote on your own ${targetType}` : "Downvote"}
            >
                <ArrowDown className="w-4 h-4" />
            </Button>
        </div>
    )
}
