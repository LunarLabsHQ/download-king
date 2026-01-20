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
            {/* Left Side - Video Info */}
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

            {/* Right Side - Download Options */}
            <div className="download-options-panel">
              {/* Audio Section */}
              {result.audioOptions && result.audioOptions.length > 0 && (
                <div className="download-section">
                  <div className="section-header">
                    <span className="section-icon">🎵</span>
                    <h4 className="section-title">Music</h4>
                  </div>
                  <div className="options-list">
                    {result.audioOptions.map((option, index) => (
                      <div key={index} className="download-option-row">
                        <div className="option-info">
                          <span className="format-badge format-mp3">{option.format}</span>
                          <span className="option-quality">{option.bitrate}</span>
                          <span className="option-size">{option.size?.formatted || 'Unknown'}</span>
                        </div>
                        <button
                          className="download-btn-green"
                          onClick={() => downloadFile(option)}
                          disabled={loading}
                        >
                          <span className="btn-icon">⬇</span>
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Section */}
              {result.videoOptions && result.videoOptions.length > 0 && (
                <div className="download-section">
                  <div className="section-header">
                    <span className="section-icon">▶️</span>
                    <h4 className="section-title">Video</h4>
                  </div>
                  <div className="options-list">
                    {result.videoOptions.map((option, index) => (
                      <div key={index} className="download-option-row">
                        <div className="option-info">
                          <span className="format-badge format-mp4">{option.format}</span>
                          <span className="option-quality">{option.label}</span>
                          <span className="option-size">{option.size?.formatted || 'Unknown'}</span>
                          {option.fast && <span className="fast-badge">⚡ Fast</span>}
                        </div>
                        <button
                          className="download-btn-green"
                          onClick={() => downloadFile(option)}
                          disabled={loading}
                        >
                          <span className="btn-icon">⬇</span>
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DownloadBox
