import { Card, CardContent } from '@/components/ui/card'

export default function MessagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold mb-2">Messages Coming Soon</h3>
          <p className="text-gray-600 mb-4">Connect directly with other tennis enthusiasts</p>
        </CardContent>
      </Card>
    </div>
  )
}
