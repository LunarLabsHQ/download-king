import { useState } from 'react'
import { useDownloader } from '../hooks/useDownloader'
import { getPlaceholderImage } from '../utils/helpers'

function DownloadBox({ placeholder = "Paste your video link here...", supportedText = "Supports: YouTube, Instagram, Twitter, TikTok, Facebook & more" }) {
  const [url, setUrl] = useState('')
  const { loading, error, result, processVideo, downloadFile, reset } = useDownloader()

  const handleSubmit = (e) => {
    e.preventDefault()
    processVideo(url)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text.trim())
    } catch (err) {
      console.error('Failed to paste:', err)
    }
  }

  const handleInputChange = (e) => {
    setUrl(e.target.value)
    if (result) reset()
  }

  return (
    <div className="download-box-wrapper">
      {/* Main Download Form */}
      <div className="download-box">
        <form onSubmit={handleSubmit} className="download-form">
          <div className="input-wrapper">
            <input
              type="url"
              value={url}
              onChange={handleInputChange}
              className="url-input"
              placeholder={placeholder}
              required
              autoComplete="off"
            />
            <button type="submit" className="download-btn" disabled={loading}>
              <span className="btn-text">{loading ? 'Processing...' : 'Download'}</span>
              <span className="btn-icon">⬇️</span>
            </button>
          </div>
          <p className="supported-text">{supportedText}</p>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state active">
          <div className="spinner"></div>
          <p>Fetching video information...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message active">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Result Section */}
      {result && !loading && (
        <div className="result-section active">
          <div className="download-result-container">
            {/* Video Info */}
            <div className="video-info-card">
              <img
                src={result.thumbnail}
                alt="Video thumbnail"
                className="video-thumbnail"
                onError={(e) => { e.target.src = getPlaceholderImage() }}
              />
              <div className="video-details">
                <h3 className="video-title">{result.filename}</h3>
                {result.duration && (
                  <p className="video-duration">Duration: {Math.floor(result.duration / 60)}:{String(Math.floor(result.duration % 60)).padStart(2, '0')}</p>
                )}
              </div>
            </div>

            {/* Simple Download Button */}
            <div className="simple-download-section">
              <button
                className="download-btn-green large"
                onClick={() => {
                  // Auto-select best quality video option (first one or primary)
                  const bestOption = result.videoOptions?.find(opt => opt.primary) || result.videoOptions?.[0] || result.audioOptions?.[0]
                  if (bestOption) {
                    downloadFile(bestOption)
                  }
                }}
                disabled={loading}
              >
                <span className="btn-icon">⬇</span>
                Download Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DownloadBox
