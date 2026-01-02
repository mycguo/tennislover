'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { ListingCategory, ListingCondition } from '@/types/marketplace'

const CATEGORIES: { value: ListingCategory | 'all', label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'racquet', label: 'Racquets' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'bag', label: 'Bags' },
    { value: 'apparel', label: 'Apparel' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'balls', label: 'Balls' },
]

const CONDITIONS: { value: ListingCondition | 'all', label: string }[] = [
    { value: 'all', label: 'Any Condition' },
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
]

export function ListingFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentCategory = searchParams.get('category') || 'all'
    const currentCondition = searchParams.get('condition') || 'all'

    function updateFilter(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (value === 'all') {
            params.delete(key)
        } else {
            params.set(key, value)
        }
        router.push(`/marketplace?${params.toString()}`)
    }

    function clearFilters() {
        router.push('/marketplace')
    }

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle className="flex justify-between items-center text-lg">
                    Filters
                    {(currentCategory !== 'all' || currentCondition !== 'all') && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-xs h-8 text-muted-foreground hover:text-primary"
                        >
                            Reset
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Label>Category</Label>
                    <RadioGroup
                        value={currentCategory}
                        onValueChange={(val: string) => updateFilter('category', val)}
                    >
                        {CATEGORIES.map((cat) => (
                            <div key={cat.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={cat.value} id={`cat-${cat.value}`} />
                                <Label htmlFor={`cat-${cat.value}`} className="font-normal cursor-pointer">
                                    {cat.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div className="space-y-3">
                    <Label>Condition</Label>
                    <RadioGroup
                        value={currentCondition}
                        onValueChange={(val: string) => updateFilter('condition', val)}
                    >
                        {CONDITIONS.map((cond) => (
                            <div key={cond.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={cond.value} id={`cond-${cond.value}`} />
                                <Label htmlFor={`cond-${cond.value}`} className="font-normal cursor-pointer">
                                    {cond.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            </CardContent>
        </Card>
    )
}
