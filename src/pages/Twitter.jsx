import DownloadBox from '../components/DownloadBox'
import CookieManager from '../components/CookieManager'
import { TwitterIcon } from '../components/Icons'

function Twitter() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero platform-hero">
        <div className="container">
          <div className="hero-content">
            <div className="platform-header">
              <div className="platform-icon" style={{ color: '#000000' }}>
                <TwitterIcon />
              </div>
              <h1>Twitter/X Video Downloader</h1>
            </div>
            <p className="hero-subtitle">
              Download videos and GIFs from Twitter/X tweets instantly.
              Save media in the highest available quality.
            </p>

            <DownloadBox
              placeholder="Paste Twitter/X tweet link here..."
              supportedText="Examples: twitter.com/user/status/... or x.com/user/status/..."
            />

            {/* Platform Features */}
            <div className="platform-features">
              <h3>Twitter/X Download Features</h3>
              <ul>
                <li>✓ Download videos in HD quality</li>
                <li>✓ Save GIFs as video or animated GIF</li>
                <li>✓ Multiple quality options</li>
                <li>✓ Works with both twitter.com and x.com</li>
                <li>✓ Download from quoted tweets</li>
                <li>✓ Thread video support</li>
                <li>✓ Protected tweets (with cookies)</li>
                <li>✓ Audio extraction</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="hero-bg"></div>
      </section>

      {/* How to Download */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How to Download Twitter Videos</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Find Tweet</h3>
              <p>Open Twitter/X and find the tweet with the video or GIF you want.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Copy Link</h3>
              <p>Click Share button and select "Copy link to Tweet" or copy from address bar.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Download</h3>
              <p>Paste the link above and click download to save the video.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Section */}
      <CookieManager platform="Twitter" />

      {/* Tips Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Tips for Twitter Downloads</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎬</div>
              <h3>Video Quality</h3>
              <p>Twitter videos are available in multiple qualities. We provide the highest available resolution.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎭</div>
              <h3>GIF Downloads</h3>
              <p>Twitter GIFs are actually MP4 videos. We convert them to true GIF format if needed.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>URL Formats</h3>
              <p>Both twitter.com and x.com URLs work. You can also use shortened t.co links.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Twitter
