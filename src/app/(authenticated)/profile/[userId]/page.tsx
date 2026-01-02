import { Card, CardContent } from '@/components/ui/card'

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">👤</div>
          <h3 className="text-xl font-semibold mb-2">User Profiles Coming Soon</h3>
          <p className="text-gray-600 mb-4">View player stats, activity, and tennis journey</p>
        </CardContent>
      </Card>
    </div>
  )
}
