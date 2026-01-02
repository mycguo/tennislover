'use client'

import { useState, useEffect } from 'react'
import AliasSetupDialog from './AliasSetupDialog'

interface AliasPromptProps {
    userId: string
    hasAlias: boolean
}

export default function AliasPrompt({ userId, hasAlias }: AliasPromptProps) {
    const [showDialog, setShowDialog] = useState(false)

    useEffect(() => {
        // Show dialog on mount if user doesn't have an alias
        if (!hasAlias) {
            setShowDialog(true)
        }
    }, [hasAlias])

    return (
        <AliasSetupDialog
            open={showDialog}
            onOpenChange={setShowDialog}
            userId={userId}
        />
    )
}
