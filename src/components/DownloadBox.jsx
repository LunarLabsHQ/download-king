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

      {/* Result Section - Simple Download Only */}
      {result && !loading && (
        <div className="result-section active">
          <div className="download-result-container">
            <div className="simple-download-section">
              <button
                className="download-btn-green large"
                onClick={() => {
                  const bestOption =
                    result.videoOptions?.find(opt => opt.primary) ||
                    result.videoOptions?.[0] ||
                    result.audioOptions?.[0]

                  if (bestOption) {
                    downloadFile(bestOption)
                  }
                }}
                disabled={loading}
              >
                <span className="btn-icon">⬇</span>
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DownloadBox
