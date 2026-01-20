import DownloadBox from '../components/DownloadBox'
import CookieManager from '../components/CookieManager'
import { InstagramIcon } from '../components/Icons'

function Instagram() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero platform-hero">
        <div className="container">
          <div className="hero-content">
            <div className="platform-header">
              <div className="platform-icon" style={{ color: '#e4405f' }}>
                <InstagramIcon />
              </div>
              <h1>Instagram Video Downloader</h1>
            </div>
            <p className="hero-subtitle">
              Download Instagram Reels, Stories, IGTV videos, and photos.
              Save any public Instagram content instantly.
            </p>

            <DownloadBox
              placeholder="Paste Instagram post or reel link here..."
              supportedText="Examples: instagram.com/p/... or instagram.com/reel/..."
            />

            {/* Platform Features */}
            <div className="platform-features">
              <h3>Instagram Download Features</h3>
              <ul>
                <li>✓ Download Reels in HD</li>
                <li>✓ Save Stories (public accounts)</li>
                <li>✓ Download IGTV videos</li>
                <li>✓ Save photos and carousels</li>
                <li>✓ Profile picture download</li>
                <li>✓ Private content (with cookies)</li>
                <li>✓ Batch download from carousel</li>
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
          <h2 className="section-title">How to Download Instagram Content</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Find Content</h3>
              <p>Open Instagram and find the Reel, post, or story you want to download.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Copy Link</h3>
              <p>Tap the three dots menu and select "Copy Link" or "Share" to get the URL.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Download</h3>
              <p>Paste the link above and click download to save the content.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Section */}
      <CookieManager platform="Instagram" />

      {/* Tips Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Tips for Instagram Downloads</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile App</h3>
              <p>On the Instagram app, tap the three dots on any post and select "Link" to copy.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h3>Stories</h3>
              <p>For stories, view the story and copy the link from your browser's address bar.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📸</div>
              <h3>Carousels</h3>
              <p>All images and videos from carousel posts are downloaded automatically.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Instagram
