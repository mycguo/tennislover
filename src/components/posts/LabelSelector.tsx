'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Label {
    id: string
    name: string
    color: string
    description: string | null
}

interface LabelSelectorProps {
    selectedLabels: string[]
    onLabelsChange: (labelIds: string[]) => void
    maxLabels?: number
}

export default function LabelSelector({
    selectedLabels,
    onLabelsChange,
    maxLabels = 5,
}: LabelSelectorProps) {
    const [labels, setLabels] = useState<Label[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchLabels() {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('labels')
                .select('*')
                .order('name')

            if (!error && data) {
                setLabels(data)
            }
            setLoading(false)
        }

        fetchLabels()
    }, [])

    const toggleLabel = (labelId: string) => {
        if (selectedLabels.includes(labelId)) {
            onLabelsChange(selectedLabels.filter(id => id !== labelId))
        } else {
            if (selectedLabels.length >= maxLabels) {
                alert(`Maximum ${maxLabels} labels allowed`)
                return
            }
            onLabelsChange([...selectedLabels, labelId])
        }
    }

    if (loading) {
        return <div className="text-sm text-gray-500">Loading labels...</div>
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {labels.map(label => {
                    const isSelected = selectedLabels.includes(label.id)
                    return (
                        <button
                            key={label.id}
                            type="button"
                            onClick={() => toggleLabel(label.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${isSelected
                                ? 'ring-2 ring-offset-2'
                                : 'opacity-60 hover:opacity-100'
                                }`}
                            style={{
                                backgroundColor: label.color,
                                color: '#ffffff',
                            }}
                            title={label.description || undefined}
                        >
                            {label.name}
                            {isSelected && <X className="w-3 h-3" />}
                        </button>
                    )
                })}
            </div>
            {selectedLabels.length > 0 && (
                <p className="text-xs text-gray-500">
                    {selectedLabels.length}/{maxLabels} labels selected
                </p>
            )}
        </div>
    )
}
