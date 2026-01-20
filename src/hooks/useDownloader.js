import { useState, useCallback } from 'react'
import { fetchVideoInfo, downloadVideoWithQuality, parseDownloadResult, initiateDownload } from '../services/downloader'
import { isValidUrl, detectPlatform, getYouTubeThumbnail, getPlaceholderImage } from '../utils/helpers'
import { useToast } from '../context/ToastContext'

/**
 * Get saved cookies from localStorage
 */
function getSavedCookies() {
  try {
    return localStorage.getItem('userCookies') || ''
  } catch {
    return ''
  }
}

export function useDownloader() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const { showToast } = useToast()

  const processVideo = useCallback(async (url) => {
    // Reset state
    setLoading(true)
    setError(null)
    setResult(null)

    // Validate URL
    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      setError('Please enter a video URL')
      setLoading(false)
      return
    }

    if (!isValidUrl(trimmedUrl)) {
      setError('Please enter a valid URL')
      setLoading(false)
      return
    }

    const platform = detectPlatform(trimmedUrl)
    if (platform === null) {
      setError('Invalid URL format')
      setLoading(false)
      return
    }

    try {
      // Get cookies from localStorage and pass to API
      const cookies = getSavedCookies()
      const data = await fetchVideoInfo(trimmedUrl, { cookies })
      const parsed = parseDownloadResult(data, trimmedUrl)

      // Get thumbnail
      let thumbnail = getYouTubeThumbnail(trimmedUrl)
      if (!thumbnail) {
        thumbnail = getPlaceholderImage()
      }

      setResult({
        ...parsed,
        thumbnail,
        platform,
        originalUrl: trimmedUrl
      })

      showToast('Video ready for download!', 'success')
    } catch (err) {
      console.error('Download error:', err)
      setError(err.message || 'Failed to process video. Please try again.')
      showToast(err.message || 'Failed to process video', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  const downloadFile = useCallback(async (option) => {
    // If option has a URL (old format from Cobalt), use direct download
    if (option.url) {
      showToast(`Starting download: ${option.label}`, 'success')
      const filename = `${result?.filename || 'video'}.${option.format?.toLowerCase() || 'mp4'}`
      initiateDownload(option.url, filename)
      return
    }

    // If option has quality (new format), download with quality
    if (option.quality && result?.originalUrl) {
      try {
        showToast(`Preparing download: ${option.label}`, 'success')
        setLoading(true)

        const cookies = getSavedCookies()
        const downloadUrl = await downloadVideoWithQuality(result.originalUrl, option.quality, { cookies })

        setLoading(false)

        // Generate filename based on video title and format
        const isAudio = option.quality === 'audio'
        const ext = isAudio ? 'mp3' : 'mp4'
        const sanitizedTitle = (result.filename || 'video')
          .replace(/[^a-z0-9]/gi, '_')
          .substring(0, 100)
        const filename = `${sanitizedTitle}_${option.label}.${ext}`

        showToast(`Downloading: ${option.label}`, 'success')
        initiateDownload(downloadUrl, filename)
      } catch (error) {
        setLoading(false)
        console.error('Download error:', error)
        showToast(error.message || 'Download failed', 'error')
      }
    }
  }, [result, showToast])

  const downloadAudio = useCallback(async (originalUrl) => {
    try {
      const cookies = getSavedCookies()
      const audioResult = await fetchAudioOnly(originalUrl, { cookies })
      if (audioResult.url) {
        initiateDownload(audioResult.url)
        showToast('Audio download started!', 'success')
      }
    } catch (err) {
      showToast('Failed to get audio', 'error')
    }
  }, [showToast])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setResult(null)
  }, [])

  return {
    loading,
    error,
    result,
    processVideo,
    downloadFile,
    downloadAudio,
    reset
  }
}
