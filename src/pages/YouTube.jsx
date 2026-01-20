import DownloadBox from '../components/DownloadBox'
import CookieManager from '../components/CookieManager'
import { YouTubeIcon } from '../components/Icons'

function YouTube() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero platform-hero">
        <div className="container">
          <div className="hero-content">
            <div className="platform-header">
              <div className="platform-icon" style={{ color: '#ff0000' }}>
                <YouTubeIcon />
              </div>
              <h1>YouTube Video Downloader</h1>
            </div>
            <p className="hero-subtitle">
              Download YouTube videos, shorts, playlists, and music in HD quality.
              Convert to MP4 or MP3 format instantly.
            </p>

            <DownloadBox
              placeholder="Paste YouTube video link here..."
              supportedText="Examples: youtube.com/watch?v=... or youtu.be/..."
            />

            {/* Platform Features */}
            <div className="platform-features">
              <h3>YouTube Download Features</h3>
              <ul>
                <li>✓ Download videos up to 4K quality</li>
                <li>✓ Convert to MP3 audio</li>
                <li>✓ Download YouTube Shorts</li>
                <li>✓ Playlist support</li>
                <li>✓ Age-restricted videos (with cookies)</li>
                <li>✓ Private videos (with cookies)</li>
                <li>✓ Subtitles download</li>
                <li>✓ Thumbnail extraction</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="hero-bg"></div>
      </section>

      {/* How to Download */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How to Download YouTube Videos</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Copy URL</h3>
              <p>Go to YouTube and copy the video URL from the address bar or share button.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Paste Link</h3>
              <p>Paste the copied URL into the input field above.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Download</h3>
              <p>Click download and choose your preferred quality format.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Section */}
      <CookieManager platform="YouTube" />

      {/* Tips Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Tips for YouTube Downloads</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎬</div>
              <h3>Video Quality</h3>
              <p>For best quality, choose the highest resolution available. 4K videos may take longer to process.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎵</div>
              <h3>Audio Only</h3>
              <p>Use the MP3 option to download only the audio track for music videos.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Playlists</h3>
              <p>For playlists, paste the playlist URL. Videos will be processed individually.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default YouTube
