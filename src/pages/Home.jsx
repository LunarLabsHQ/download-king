import { Link } from 'react-router-dom'
import DownloadBox from '../components/DownloadBox'
import CookieManager from '../components/CookieManager'
import { YouTubeIcon, InstagramIcon, TwitterIcon, TikTokIcon } from '../components/Icons'

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Download Videos from <span className="gradient-text">Any Platform</span>
            </h1>
            <p className="hero-subtitle">
              Free, fast, and secure video downloads from YouTube, Instagram, Twitter and more.
              No registration required.
            </p>

            <DownloadBox />
          </div>
        </div>
        <div className="hero-bg"></div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Download King?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Download videos in seconds with our optimized processing engine.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>100% Secure</h3>
              <p>All processing happens in your browser. We never store your data.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Works perfectly on all devices - desktop, tablet, and mobile.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>HD Quality</h3>
              <p>Download videos in the highest available quality up to 4K.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🆓</div>
              <h3>Completely Free</h3>
              <p>No hidden fees, no subscriptions, no registration required.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Multi-Platform</h3>
              <p>Support for 1000+ websites including all major social platforms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="platforms">
        <div className="container">
          <h2 className="section-title">Supported Platforms</h2>
          <div className="platforms-grid">
            <Link to="/youtube" className="platform-card youtube">
              <div className="platform-icon">
                <YouTubeIcon />
              </div>
              <h3>YouTube</h3>
              <p>Download videos, shorts, and playlists</p>
            </Link>
            <Link to="/instagram" className="platform-card instagram">
              <div className="platform-icon">
                <InstagramIcon />
              </div>
              <h3>Instagram</h3>
              <p>Reels, stories, and posts</p>
            </Link>
            <Link to="/twitter" className="platform-card twitter">
              <div className="platform-icon">
                <TwitterIcon />
              </div>
              <h3>Twitter/X</h3>
              <p>Videos and GIFs from tweets</p>
            </Link>
            <div className="platform-card tiktok">
              <div className="platform-icon">
                <TikTokIcon />
              </div>
              <h3>TikTok</h3>
              <p>Videos without watermark</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Section */}
      <CookieManager platform="social media platforms" />

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Paste Link</h3>
              <p>Copy the video URL from your favorite platform and paste it in the input box above.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Choose Quality</h3>
              <p>Select your preferred video quality from the available options.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Download</h3>
              <p>Click download and save the video directly to your device.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
