import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SkillsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Skills Exchange</h1>
        <Button asChild>
          <Link href="/skills/create">Post Opportunity</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">🤝</div>
          <h3 className="text-xl font-semibold mb-2">Skills Exchange Coming Soon</h3>
          <p className="text-gray-600 mb-4">Find coaches, hitting partners, and practice groups</p>
        </CardContent>
      </Card>
    </div>
  )
}
