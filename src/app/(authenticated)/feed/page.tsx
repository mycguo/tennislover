import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function FeedPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      author:users(id, full_name, alias, avatar_url, skill_level)
    `)
    .order('created_at', { ascending: false })
    .limit(20)

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
                <CardTitle className="text-xl">
                  <Link href={`/feed/${post.id}`} className="hover:text-green-600">
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base line-clamp-3">
                  {post.content}
                </CardDescription>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span>👁️ {post.view_count} views</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
