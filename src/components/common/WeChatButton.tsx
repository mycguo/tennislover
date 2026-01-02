'use client'

import { Button } from '@/components/ui/button'

export default function WeChatButton({
  variant = 'default',
  size = 'default',
}: {
  variant?: 'default' | 'outline'
  size?: 'default' | 'lg' | 'sm'
}) {
  const handleSignIn = () => {
    // Redirect to Auth0 WeChat login
    window.location.href = '/api/auth/login'
  }

  return (
    <Button
      onClick={handleSignIn}
      variant={variant}
      size={size}
      className="gap-2 bg-green-500 hover:bg-green-600 text-white"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        {/* WeChat logo */}
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.273c-.019.061-.048.145-.048.145-.013.066-.016.115.006.163.025.053.075.089.134.107.054.017.091.014.091.014l1.461-.253a.689.689 0 0 1 .577.104c1.131.765 2.491 1.207 3.944 1.207 4.8 0 8.691-3.288 8.691-7.342 0-4.054-3.891-7.342-8.691-7.342zm-.278 9.544a.998.998 0 1 1-.002-1.996.998.998 0 0 1 .002 1.996zm4.184 0a.998.998 0 1 1 0-1.996.998.998 0 0 1 0 1.996z"/>
        <path d="M23.035 11.639c0-3.403-3.38-6.162-7.553-6.162-4.173 0-7.553 2.759-7.553 6.162s3.38 6.162 7.553 6.162c1.232 0 2.397-.244 3.448-.67a.577.577 0 0 1 .479-.087l1.208.264s.037.003.075-.012a.137.137 0 0 0 .111-.089.152.152 0 0 0-.005-.135s-.024-.07-.04-.12l-.323-1.054a.488.488 0 0 1 .177-.551c1.548-1.123 2.423-2.767 2.423-4.708zm-9.77-.867a.827.827 0 1 1 0-1.654.827.827 0 0 1 0 1.654zm4.416 0a.827.827 0 1 1 0-1.654.827.827 0 0 1 0 1.654z"/>
      </svg>
      Continue with WeChat
    </Button>
  )
}
