import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Features() {
  const features = [
    {
      icon: '💬',
      title: 'Share & Discuss',
      description: 'Join vibrant discussions about techniques, matches, and everything tennis. Share your journey and learn from others.',
    },
    {
      icon: '🎾',
      title: 'Trade Equipment',
      description: 'Buy, sell, or trade tennis gear with fellow enthusiasts. Find that perfect racket or sell equipment you no longer use.',
    },
    {
      icon: '📅',
      title: 'Tennis Events',
      description: 'Discover and join local tournaments, clinics, social play sessions, and leagues. Create your own events and build the tennis community.',
    },
    {
      icon: '👥',
      title: 'Build Your Profile',
      description: 'Showcase your tennis stats, skill level, and achievements. Connect with players who match your level and interests.',
    },
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            All the tools to connect, learn, and grow in your tennis journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-green-500 transition-colors">
              <CardHeader>
                <div className="text-5xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
