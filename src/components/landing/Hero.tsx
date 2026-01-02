'use client'

import { Button } from '@/components/ui/button'
import AuthButton from '@/components/common/AuthButton'
import WeChatButton from '@/components/common/WeChatButton'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 min-h-screen flex items-center overflow-hidden">
      {/* Decorative tennis ball graphics */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-green-400 rounded-full opacity-20 blur-3xl"></div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-white/80 rounded-full shadow-sm">
              <span className="text-green-600 font-semibold">🎾 Join the Community</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Your Tennis
              <span className="text-green-600"> Community</span>
              <br />
              Awaits
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              Connect with fellow tennis lovers, share your passion, trade equipment,
              find hitting partners, and level up your game together.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <AuthButton variant="default" size="lg" />
                <WeChatButton variant="default" size="lg" />
              </div>
              <Button variant="outline" size="lg" onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
              }}>
                Explore Community
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Sign in with Google or WeChat to get started
              </p>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Active Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Posts Shared</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">5K+</div>
                <div className="text-sm text-gray-600">Equipment Traded</div>
              </div>
            </div>
          </div>

          {/* Right content - Hero image placeholder */}
          <div className="relative">
            <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-200 to-yellow-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-9xl mb-4">🎾</div>
                <p className="text-2xl font-semibold text-gray-700">Tennis Community</p>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎾</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Just traded!</div>
                  <div className="text-sm text-gray-600">Wilson Pro Staff 97</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
