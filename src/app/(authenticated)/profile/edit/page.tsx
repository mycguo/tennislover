import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileEditForm from '@/components/profile/ProfileEditForm'

export default async function EditProfilePage() {
    const supabase = await createClient()

    // Get Logged In User
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    // Get User Profile Data
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch Stats
    // Post Count
    const { count: postCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user.id)

    // Comment Count
    const { count: commentCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user.id)

    // Combine Data
    const userData = {
        id: user.id,
        email: user.email!,
        full_name: profile?.full_name || '',
        alias: profile?.alias || null
    }

    const statsData = {
        postCount: postCount || 0,
        commentCount: commentCount || 0,
        lastLogin: user.last_sign_in_at || null
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
            <ProfileEditForm user={userData} stats={statsData} />
        </div>
    )
}
