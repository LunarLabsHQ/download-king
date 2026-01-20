/**
 * Validate if a string is a valid URL
 */
export function isValidUrl(string) {
  try {
    const url = new URL(string)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (_) {
    return false
  }
}

/**
 * Detect platform from URL
 */
export function detectPlatform(url) {
  const platforms = {
    youtube: ['youtube.com', 'youtu.be', 'youtube-nocookie.com'],
    instagram: ['instagram.com', 'instagr.am'],
    twitter: ['twitter.com', 'x.com', 't.co'],
    tiktok: ['tiktok.com', 'vm.tiktok.com'],
    facebook: ['facebook.com', 'fb.com', 'fb.watch'],
    vimeo: ['vimeo.com'],
    dailymotion: ['dailymotion.com'],
    twitch: ['twitch.tv', 'clips.twitch.tv'],
    reddit: ['reddit.com', 'v.redd.it'],
    pinterest: ['pinterest.com', 'pin.it']
  }

  try {
    const hostname = new URL(url).hostname.replace('www.', '')

    for (const [platform, domains] of Object.entries(platforms)) {
      if (domains.some(domain => hostname.includes(domain))) {
        return platform
      }
    }
  } catch (_) {
    return null
  }

  return 'other'
}

/**
 * Extract YouTube video ID from URL
 */
export function extractYouTubeId(url) {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.replace('www.', '')

    if (hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1).split('?')[0]
    }

    if (hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v')
    }
  } catch (_) {
    return null
  }

  return null
}

/**
 * Get YouTube thumbnail URL
 */
export function getYouTubeThumbnail(url) {
  const videoId = extractYouTubeId(url)
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }
  return null
}

/**
 * Format file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format duration in seconds to mm:ss or hh:mm:ss
 */
export function formatDuration(seconds) {
  if (!seconds) return '--:--'

  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Get placeholder image SVG as data URL
 */
export function getPlaceholderImage() {
  return 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">
      <rect width="320" height="180" fill="#1a1a25"/>
      <circle cx="160" cy="90" r="30" fill="#6366f1"/>
      <polygon points="150,75 150,105 175,90" fill="white"/>
    </svg>
  `)
}
