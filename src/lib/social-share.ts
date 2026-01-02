/**
 * Generate Facebook share URL
 */
export function getFacebookShareUrl(url: string): string {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
}

/**
 * Generate Twitter share URL
 */
export function getTwitterShareUrl(url: string, text: string, hashtags?: string[]): string {
    const params = new URLSearchParams({
        url,
        text,
    })

    if (hashtags && hashtags.length > 0) {
        params.append('hashtags', hashtags.join(','))
    }

    return `https://twitter.com/intent/tweet?${params.toString()}`
}

/**
 * Generate LinkedIn share URL
 */
export function getLinkedInShareUrl(url: string): string {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text)
            return true
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea')
            textArea.value = text
            textArea.style.position = 'fixed'
            textArea.style.left = '-999999px'
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()

            try {
                document.execCommand('copy')
                textArea.remove()
                return true
            } catch (error) {
                console.error('Fallback: Oops, unable to copy', error)
                textArea.remove()
                return false
            }
        }
    } catch (error) {
        console.error('Failed to copy to clipboard:', error)
        return false
    }
}

/**
 * Check if Web Share API is available
 */
export function canUseWebShare(): boolean {
    return typeof navigator !== 'undefined' && 'share' in navigator
}

/**
 * Share using Web Share API (mobile)
 */
export async function shareViaWebShare(data: {
    title: string
    text: string
    url: string
}): Promise<boolean> {
    if (!canUseWebShare()) {
        return false
    }

    try {
        await navigator.share(data)
        return true
    } catch (error) {
        // User cancelled or error occurred
        console.error('Web Share failed:', error)
        return false
    }
}

/**
 * Open share URL in new window
 */
export function openShareWindow(url: string, width = 600, height = 400): void {
    const left = (window.innerWidth - width) / 2
    const top = (window.innerHeight - height) / 2

    window.open(
        url,
        'share',
        `width=${width},height=${height},left=${left},top=${top},toolbar=0,status=0`
    )
}
