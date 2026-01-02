import Link from 'next/link'
import AuthButton from '@/components/common/AuthButton'

export default function LandingHeader() {
    return (
        <header className="absolute top-0 left-0 right-0 z-50">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-3xl">🎾</span>
                    <span className="text-xl font-bold text-gray-900">Tennis Lover</span>
                </Link>
                <AuthButton variant="ghost" className="font-medium text-gray-700 hover:text-green-600 hover:bg-green-50" showIcon={true}>
                    Log In
                </AuthButton>
            </div>
        </header>
    )
}
