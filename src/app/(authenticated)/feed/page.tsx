import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import VoteButtons from '@/components/posts/VoteButtons'

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
          {posts.map((post) => {
            const labels = (post.label_assignments || []).map((la: any) => la.label)
            const firstImage = (post.images || []).sort((a: any, b: any) => a.display_order - b.display_order)[0]
            const imageCount = (post.images || []).length

            return (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
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
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <VoteButtons
                      postId={post.id}
                      initialScore={post.vote_score || 0}
                      initialUserVote={userVotes[post.id] || null}
                      userId={user?.id}
                      authorId={post.author_id}
                    />
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.view_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comment_count || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
