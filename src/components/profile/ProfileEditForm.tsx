'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MessageSquare, FileText } from 'lucide-react'

interface ProfileEditFormProps {
    user: {
        id: string
        full_name: string | null
        alias: string | null
        email: string
    }
    stats: {
        postCount: number
        commentCount: number
        lastLogin: string | null
    }
}

export default function ProfileEditForm({ user, stats }: ProfileEditFormProps) {
    const router = useRouter()
    const supabase = createClient()
    const [alias, setAlias] = useState(user.alias || '')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const { error } = await supabase
                .from('users')
                .update({ alias: alias.trim() || null })
                .eq('id', user.id)

            if (error) throw error

            setMessage('Profile updated successfully!')
            router.refresh()
        } catch (error) {
            console.error('Error updating profile:', error)
            setMessage('Failed to update profile.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={user.email} disabled className="bg-gray-100" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" value={user.full_name || ''} disabled className="bg-gray-100" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="alias">Alias (Display Name)</Label>
                            <Input
                                id="alias"
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                                placeholder="Choose a display name"
                                maxLength={50}
                            />
                            <p className="text-xs text-gray-500">
                                This is how you will appear to other users. If left blank, your full name will be used.
                            </p>
                        </div>

                        {message && (
                            <div className={`p-3 rounded text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message}
                            </div>
                        )}

                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Posts
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.postCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Comments
                        </CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.commentCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Last Login
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">
                            {stats.lastLogin ? new Date(stats.lastLogin).toLocaleDateString() + ' ' + new Date(stats.lastLogin).toLocaleTimeString() : 'Never'}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
