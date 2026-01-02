'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

interface AliasSetupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

export default function AliasSetupDialog({ open, onOpenChange, userId }: AliasSetupDialogProps) {
  const router = useRouter()
  const supabase = createClient()
  const [alias, setAlias] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!alias.trim()) {
      setError('Please enter an alias')
      return
    }

    if (alias.length > 50) {
      setError('Alias must be 50 characters or less')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ alias: alias.trim() })
        .eq('id', userId)

      if (updateError) throw updateError

      onOpenChange(false)
      router.refresh()
    } catch (err) {
      console.error('Error saving alias:', err)
      setError('Failed to save alias. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Your Alias</DialogTitle>
          <DialogDescription>
            Choose a display name that will be shown instead of your real name when you post.
            You can always change this later in your profile settings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="alias" className="text-sm font-medium">
              Alias
            </label>
            <Input
              id="alias"
              placeholder="Enter your alias"
              value={alias}
              onChange={(e) => {
                setAlias(e.target.value)
                setError('')
              }}
              maxLength={50}
              disabled={loading}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <p className="text-xs text-gray-500">
              {alias.length}/50 characters
            </p>
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            disabled={loading}
          >
            Skip for now
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Alias'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
