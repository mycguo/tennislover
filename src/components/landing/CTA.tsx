'use client'

import AuthButton from '@/components/common/AuthButton'
import WeChatButton from '@/components/common/WeChatButton'

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-600 to-green-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
          Ready to Join the Community?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Connect with thousands of tennis enthusiasts. Share your passion, improve your game, and make lasting connections.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <AuthButton variant="default" size="lg" />
          <WeChatButton variant="default" size="lg" />
        </div>
        <p className="mt-4 text-sm opacity-75">
          Free to join • No credit card required
        </p>
      </div>
    </section>
  )
}
