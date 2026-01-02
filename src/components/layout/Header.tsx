'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  user: {
    id: string
    email?: string
    full_name?: string
    avatar_url?: string
    auth_provider?: string
  } | null
}

export default function Header({ user }: HeaderProps) {
  const handleSignOut = async () => {
    // Check auth provider and sign out accordingly
    if (user?.auth_provider === 'auth0-wechat') {
      // Auth0 logout
      window.location.href = '/api/auth/logout'
    } else {
      // Supabase logout
      await fetch('/auth/signout', { method: 'POST' })
      window.location.href = '/'
    }
  }

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/feed" className="flex items-center gap-2">
            <span className="text-2xl">🎾</span>
            <span className="text-xl font-bold text-gray-900">Tennis Lover</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/feed" className="text-gray-600 hover:text-gray-900 font-medium">
              Feed
            </Link>
            <Link href="/marketplace" className="text-gray-600 hover:text-gray-900 font-medium">
              Marketplace
            </Link>
            <Link href="/skills" className="text-gray-600 hover:text-gray-900 font-medium">
              Skills
            </Link>
            <Link href="/messages" className="text-gray-600 hover:text-gray-900 font-medium">
              Messages
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/create-post">Create Post</Link>
            </Button>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={user.avatar_url} alt={user.full_name || user.email || 'User'} />
                      <AvatarFallback>
                        {(user.full_name || user.email || 'U')[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.full_name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.id}`}>Your Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/edit">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
