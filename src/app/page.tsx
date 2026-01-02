import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import CommunityShowcase from '@/components/landing/CommunityShowcase'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/layout/Footer'
import LandingHeader from '@/components/landing/LandingHeader'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <LandingHeader />
      <Hero />
      <Features />
      <HowItWorks />
      <CommunityShowcase />
      <CTA />
      <Footer />
    </main>
  )
}
