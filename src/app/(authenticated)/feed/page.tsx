import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import PostCard from '@/components/posts/PostCard'

export default async function FeedPage() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch posts with all related data
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      author:users(id, full_name, alias, avatar_url, skill_level),
      images:post_images(id, storage_path, display_order),
      label_assignments:post_label_assignments(
        label:labels(id, name, color)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(20)

  // Get user votes if logged in
  let userVotes: Record<string, number> = {}
  if (user && posts) {
    const postIds = posts.map(p => p.id)
    const { data: votes } = await supabase
      .from('post_votes')
      .select('post_id, vote_type')
      .eq('user_id', user.id)
      .in('post_id', postIds)

    if (votes) {
      userVotes = votes.reduce((acc, vote) => {
        acc[vote.post_id] = vote.vote_type
        return acc
      }, {} as Record<string, number>)
    }
  }

  // Fetch latest comments for these posts
  // Strategy: Fetch all comments for these posts, ordered by date desc.
  // Then in memory, pick the first one for each post.
  let latestCommentsMap: Record<string, any> = {}
  if (posts && posts.length > 0) {
    const postIds = posts.map(p => p.id)
    const { data: allComments } = await supabase
      .from('comments')
      .select(`
        id, content, created_at, post_id,
        author:users(alias, full_name)
      `)
      .in('post_id', postIds)
      .order('created_at', { ascending: false })

    if (allComments) {
      allComments.forEach(c => {
        if (!latestCommentsMap[c.post_id]) {
          latestCommentsMap[c.post_id] = c
        }
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discussion Feed</h1>
        <Button asChild>
          <Link href="/create-post">Create Post</Link>
        </Button>
      </div>

      {!posts || posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">Be the first to start a discussion!</p>
            <Button asChild>
              <Link href="/create-post">Create First Post</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              userId={user?.id}
              userVote={userVotes[post.id] || null}
              initialLatestComment={latestCommentsMap[post.id] || null}
            />
          ))}
        </div>
      )}
    </div>
  )
}
