/**
 * Download King - Video Downloader Service
 * Uses local yt-dlp backend for reliable downloads
 */

const CONFIG = {
  LOCAL_BACKEND: 'http://api.downloadking.xyz',
  COBALT_INSTANCES: [
    'https://cobalt-api.meowing.de',
    'https://capi.3kh0.net'
  ],
  TIMEOUT: 300000 // 5 minutes for downloads
}

/**
 * Check if local backend is running
 */
async function isLocalBackendAvailable() {
  try {
    const response = await fetch(`${CONFIG.LOCAL_BACKEND}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get video info using local yt-dlp backend
 */
async function getVideoInfoFromBackend(url, options = {}) {
  console.log('[Info] Fetching video info from local backend')

  try {
    const response = await fetch(`${CONFIG.LOCAL_BACKEND}/api/info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: url,
        cookies: options.cookies || ''
      }),
      signal: AbortSignal.timeout(30000)
    })

    if (!response.ok) {
      let errorMsg = `Server error: ${response.status}`
      try {
        const text = await response.text()
        if (text) {
          try {
            const errorData = JSON.parse(text)
            errorMsg = errorData.error || errorMsg
          } catch {
            errorMsg = text || errorMsg
          }
        }
      } catch {
        // Failed to read response
      }
      throw new Error(errorMsg)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    return {
      status: 'info',
      title: data.title,
      thumbnail: data.thumbnail,
      duration: data.duration,
      uploader: data.uploader,
      url: url
    }
  } catch (error) {
    if (error.message.includes('404') || error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error('Server not available. Please start the local server: cd server && npm start')
    }
    throw error
  }
}

/**
 * Download with specific quality using local yt-dlp backend
 */
async function downloadWithLocalBackend(url, quality, options = {}) {
  console.log(`[Download] Using local yt-dlp backend - Quality: ${quality}`)

  try {
    const response = await fetch(`${CONFIG.LOCAL_BACKEND}/api/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: url,
        cookies: options.cookies || '',
        audioOnly: quality === 'audio',
        quality: quality
      }),
      signal: AbortSignal.timeout(CONFIG.TIMEOUT)
    })

    if (!response.ok) {
      let errorMsg = `Server error: ${response.status}`
      try {
        const text = await response.text()
        if (text) {
          try {
            const errorData = JSON.parse(text)
            errorMsg = errorData.error || errorMsg
          } catch {
            errorMsg = text || errorMsg
          }
        }
      } catch {
        // Failed to read response
      }
      throw new Error(errorMsg)
    }

    const text = await response.text().catch(() => '')
    if (!text || text.trim().length === 0) {
      throw new Error('Empty response from server')
    }

    let data = {}
    try {
      data = JSON.parse(text)
    } catch (error) {
      throw new Error(`Invalid response from server: ${error.message}`)
    }

    if (data.error) {
      throw new Error(data.error)
    }

    return data.url
  } catch (error) {
    if (error.message.includes('404') || error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error('Server not available. Please start the local server: cd server && npm start')
    }
    throw error
  }
}

/**
 * Try Cobalt API as fallback
 */
async function tryCobaltnon(url, options = {}) {
  const requestBody = {
    url: url,
    videoQuality: options.quality || 'max',
    audioFormat: 'mp3',
    audioBitrate: '128',
    filenameStyle: 'pretty',
    downloadMode: options.audioOnly ? 'audio' : 'auto',
    youtubeVideoCodec: 'h264',
    tiktokFullAudio: true,
    convertGif: true
  }

  for (const instance of CONFIG.COBALT_INSTANCES) {
    try {
      const apiUrl = instance.endsWith('/') ? instance : instance + '/'
      console.log(`[Cobalt] Trying: ${apiUrl}`)

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(60000)
      })

      if (!response.ok) {
        const errText = await response.text()
        let err = {}
        try {
          err = errText ? JSON.parse(errText) : {}
        } catch {
          // Invalid JSON, use text as error message
        }
        throw new Error(err.error?.code || err.text || errText || `Error ${response.status}`)
      }

      const text = await response.text()
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from server')
      }

      let data = {}
      try {
        data = JSON.parse(text)
      } catch (error) {
        throw new Error(`Invalid response from server: ${error.message}`)
      }

      if (data.status === 'error') {
        throw new Error(data.error?.code || data.text || 'Failed')
      }

      console.log(`[Cobalt] Success with ${instance}`)
      return data

    } catch (error) {
      console.warn(`[Cobalt] ${instance} failed:`, error.message)
    }
  }

  throw new Error('All Cobalt instances failed')
}

/**
 * Main fetch function - gets video info only
 */
export async function fetchVideoInfo(url, options = {}) {
  // Check if local backend is available
  const localAvailable = await isLocalBackendAvailable()

  if (localAvailable) {
    try {
      return await getVideoInfoFromBackend(url, options)
    } catch (error) {
      console.warn('[Info] Local backend error:', error.message)
      throw error
    }
  }

  // No local backend available
  throw new Error('Server not available. Please start the local server: cd server && npm start')
}

/**
 * Download video with specific quality
 */
export async function downloadVideoWithQuality(url, quality, options = {}) {
  const localAvailable = await isLocalBackendAvailable()

  if (!localAvailable) {
    throw new Error('Server not available. Please start the local server: cd server && npm start')
  }

  try {
    return await downloadWithLocalBackend(url, quality, options)
  } catch (error) {
    console.warn('[Download] Local backend error:', error.message)
    throw error
  }
}

/**
 * Fetch audio only
 */
export async function fetchAudioOnly(url, options = {}) {
  return fetchVideoInfo(url, { ...options, audioOnly: true })
}

/**
 * Initiate download - forces file download to user's PC
 */
export function initiateDownload(url, filename = 'video.mp4') {
  // Create a hidden anchor element
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = filename || 'download'

  // Add to document, click, and remove
  document.body.appendChild(a)
  a.click()

  // Clean up
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 100)
}

/**
 * Format file size in human readable format
 */
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return 'Unknown'
  const mb = bytes / (1024 * 1024)
  if (mb < 1) {
    return `${(bytes / 1024).toFixed(2)} KB`
  }
  return `${mb.toFixed(2)} MB`
}

/**
 * Estimate file size based on duration and quality
 */
function estimateFileSize(duration, quality, isAudio = false) {
  if (!duration) return null

  // Bitrate estimates (in kbps)
  const bitrates = {
    '1080': 8000,  // ~8 Mbps for 1080p
    '720': 5000,   // ~5 Mbps for 720p
    '480': 2500,   // ~2.5 Mbps for 480p
    '360': 1000,   // ~1 Mbps for 360p
    'audio_high': 256,
    'audio_mid': 128,
    'audio_low': 64
  }

  const bitrate = isAudio ? bitrates[quality] || 128 : bitrates[quality] || 5000
  const sizeInBytes = (bitrate * 1000 * duration) / 8

  return {
    bytes: sizeInBytes,
    formatted: formatFileSize(sizeInBytes),
    bitrate: bitrate
  }
}

/**
 * Parse download result
 */
export function parseDownloadResult(data, originalUrl) {
  const audioOptions = []
  const videoOptions = []

  if (data.status === 'info') {
    const duration = data.duration || 0

    // Audio options
    audioOptions.push(
      {
        label: 'High Quality',
        format: 'MP3',
        quality: 'audio',
        bitrate: '256KBPS',
        size: estimateFileSize(duration, 'audio_high', true),
        type: 'audio',
        primary: false
      },
      {
        label: 'Medium Quality',
        format: 'MP3',
        quality: 'audio',
        bitrate: '128KBPS',
        size: estimateFileSize(duration, 'audio_mid', true),
        type: 'audio',
        primary: false
      },
      {
        label: 'Low Quality',
        format: 'MP3',
        quality: 'audio',
        bitrate: '64KBPS',
        size: estimateFileSize(duration, 'audio_low', true),
        type: 'audio',
        primary: false
      }
    )

    // Video options
    videoOptions.push(
      {
        label: '1080p',
        format: 'MP4',
        quality: '1080',
        resolution: '1920x1080',
        size: estimateFileSize(duration, '1080'),
        type: 'video',
        primary: true,
        fast: true
      },
      {
        label: '720p',
        format: 'MP4',
        quality: '720',
        resolution: '1280x720',
        size: estimateFileSize(duration, '720'),
        type: 'video',
        primary: false,
        fast: false
      },
      {
        label: '480p',
        format: 'MP4',
        quality: '480',
        resolution: '854x480',
        size: estimateFileSize(duration, '480'),
        type: 'video',
        primary: false,
        fast: false
      },
      {
        label: '360p',
        format: 'MP4',
        quality: '360',
        resolution: '640x360',
        size: estimateFileSize(duration, '360'),
        type: 'video',
        primary: false,
        fast: false
      }
    )
  } else if (data.status === 'tunnel' || data.status === 'redirect' || data.status === 'stream') {
    videoOptions.push({
      label: 'Download Video',
      format: 'MP4',
      url: data.url,
      type: 'video',
      primary: true
    })
  } else if (data.status === 'picker' && data.picker) {
    data.picker.forEach((item, index) => {
      videoOptions.push({
        label: item.type === 'video' ? `Video ${index + 1}` :
               item.type === 'photo' ? `Photo ${index + 1}` :
               `Download ${index + 1}`,
        url: item.url,
        type: item.type || 'media',
        primary: index === 0
      })
    })
  }

  return {
    filename: data.title || data.filename || 'Video Download',
    duration: data.duration,
    audioOptions,
    videoOptions
  }
}
