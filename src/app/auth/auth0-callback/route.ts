import { getSession } from '@auth0/nextjs-auth0'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Get Auth0 session
    const session = await getSession()

    if (!session) {
      return NextResponse.redirect(new URL('/?error=no_session', request.url))
    }

    const { user } = session

    // Create Supabase client
    const supabase = await createClient()

    // Check if user exists in Supabase
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single()

    if (!existingUser) {
      // Create new user in Supabase
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.sub, // Use Auth0 sub as user ID
          email: user.email,
          full_name: user.name,
          avatar_url: user.picture,
        })

      if (insertError) {
        console.error('Error creating user:', insertError)
        return NextResponse.redirect(new URL('/?error=user_creation_failed', request.url))
      }
    }

    // Redirect to feed
    return NextResponse.redirect(new URL('/feed', request.url))
  } catch (error) {
    console.error('Auth0 callback error:', error)
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
  }
}
