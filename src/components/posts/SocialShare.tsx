'use client'

import { useState, useEffect } from 'react'
import { Facebook, Twitter, Linkedin, Instagram, Share2, Link as LinkIcon, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    getFacebookShareUrl,
    getTwitterShareUrl,
    getLinkedInShareUrl,
    copyToClipboard,
    openShareWindow,
    canUseWebShare,
    shareViaWebShare,
} from '@/lib/social-share'
import { createClient } from '@/lib/supabase/client'

interface SocialShareProps {
    postId: string
    postTitle: string
    postUrl: string
    shareCount?: number
}

export default function SocialShare({
    postId,
    postTitle,
    postUrl,
    shareCount = 0,
}: SocialShareProps) {
    const [copied, setCopied] = useState(false)
    const [localShareCount, setLocalShareCount] = useState(shareCount)
    const [isNativeShareAvailable, setIsNativeShareAvailable] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        // Only use native share on mobile devices where it's robust
        // On desktop, it's better to show specific buttons
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        setIsNativeShareAvailable(canUseWebShare() && isMobile)
    }, [])

    const incrementShareCount = async () => {
        try {
            await supabase.rpc('increment_post_share_count', { post_uuid: postId })
            setLocalShareCount(prev => prev + 1)
        } catch (error) {
            console.error('Failed to increment share count:', error)
        }
    }

    const handleFacebookShare = () => {
        openShareWindow(getFacebookShareUrl(postUrl))
        incrementShareCount()
    }

    const handleTwitterShare = () => {
        openShareWindow(
            getTwitterShareUrl(postUrl, postTitle, ['tennis', 'tennislover'])
        )
        incrementShareCount()
    }

    const handleLinkedInShare = () => {
        openShareWindow(getLinkedInShareUrl(postUrl))
        incrementShareCount()
    }

    const handleInstagramShare = async () => {
        // Instagram doesn't support direct web sharing
        // We copy the link and open Instagram for the user to paste/use
        await copyToClipboard(postUrl)
        setCopied(true)
        incrementShareCount()
        window.open('https://www.instagram.com/', '_blank')
        setTimeout(() => setCopied(false), 2000)
    }

    const handleCopyLink = async () => {
        const success = await copyToClipboard(postUrl)
        if (success) {
            setCopied(true)
            incrementShareCount()
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleWebShare = async () => {
        const success = await shareViaWebShare({
            title: postTitle,
            text: 'Check out this post on TennisLover',
            url: postUrl,
        })
        if (success) {
            incrementShareCount()
        }
    }

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {isNativeShareAvailable ? (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleWebShare}
                    className="gap-2"
                >
                    <Share2 className="w-4 h-4" />
                    Share
                </Button>
            ) : (
                <>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleFacebookShare}
                        className="gap-2 text-[#1877F2] hover:text-[#1877F2] hover:bg-blue-50"
                        title="Share on Facebook"
                    >
                        <Facebook className="w-4 h-4" />
                        <span className="hidden sm:inline">Facebook</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTwitterShare}
                        className="gap-2 text-[#1DA1F2] hover:text-[#1DA1F2] hover:bg-sky-50"
                        title="Share on Twitter"
                    >
                        <Twitter className="w-4 h-4" />
                        <span className="hidden sm:inline">Twitter</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLinkedInShare}
                        className="gap-2 text-[#0A66C2] hover:text-[#0A66C2] hover:bg-blue-50"
                        title="Share on LinkedIn"
                    >
                        <Linkedin className="w-4 h-4" />
                        <span className="hidden sm:inline">LinkedIn</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleInstagramShare}
                        className="gap-2 text-[#E4405F] hover:text-[#E4405F] hover:bg-pink-50"
                        title="Share on Instagram"
                    >
                        <Instagram className="w-4 h-4" />
                        <span className="hidden sm:inline">Instagram</span>
                    </Button>
                </>
            )}

            <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="gap-2"
                title="Copy link"
            >
                {copied ? (
                    <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="hidden sm:inline text-green-600">Copied!</span>
                    </>
                ) : (
                    <>
                        <LinkIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Copy Link</span>
                    </>
                )}
            </Button>

            {localShareCount > 0 && (
                <span className="text-xs text-gray-500 ml-2">
                    {localShareCount} {localShareCount === 1 ? 'share' : 'shares'}
                </span>
            )}
        </div>
    )
}
