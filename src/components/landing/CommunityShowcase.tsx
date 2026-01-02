import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function CommunityShowcase() {
  const samplePosts = [
    {
      type: 'Discussion',
      title: 'Best way to improve backhand consistency?',
      author: 'Sarah M.',
      excerpt: 'I\'ve been struggling with my backhand recently. Any tips on drills or technique improvements?',
      likes: 24,
      comments: 12,
      badge: 'tips',
    },
    {
      type: 'Equipment',
      title: 'Wilson Pro Staff 97 - Like New',
      author: 'Mike T.',
      excerpt: '$180 - Only used for 3 months. Perfect condition, grip size 3.',
      likes: 15,
      comments: 8,
      badge: 'marketplace',
    },
    {
      type: 'Skills',
      title: 'Looking for hitting partner in SF',
      author: 'Alex K.',
      excerpt: 'Intermediate player seeking regular hitting partner. Weekends preferred.',
      likes: 31,
      comments: 18,
      badge: 'skills',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            See What&apos;s Happening
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real conversations, real trades, real connections
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {samplePosts.map((post, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.badge}</Badge>
                  <span className="text-sm text-gray-500">{post.author}</span>
                </div>
                <CardTitle className="text-lg">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {post.excerpt}
                </CardDescription>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
