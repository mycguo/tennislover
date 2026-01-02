import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/layout/Header'
import AliasPrompt from '@/components/common/AliasPrompt'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Fetch full user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const userWithProfile = profile ? { ...user, ...profile } : user

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={userWithProfile} />
      <main>{children}</main>
      <AliasPrompt userId={user.id} hasAlias={!!profile?.alias} />
    </div>
  )
}
