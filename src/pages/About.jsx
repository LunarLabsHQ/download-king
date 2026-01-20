import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function About() {
  const location = useLocation()

  useEffect(() => {
    // Handle hash navigation
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [location])

  return (
    <section className="about-section">
      <div className="container">
        <div className="about-content">
          <h1>About Download King</h1>

          <p>
            Download King is a free, client-side video downloading tool that helps you save videos
            from your favorite social media platforms. Our service is designed with simplicity,
            speed, and privacy in mind.
          </p>

          <h2>Our Mission</h2>
          <p>
            We believe that users should be able to save content they enjoy for personal, offline use.
            Download King provides a simple, ad-free interface to download videos from platforms like
            YouTube, Instagram, Twitter, TikTok, and many more.
          </p>

          <h2>How It Works</h2>
          <p>
            Download King is a client-side application, meaning all processing happens in your browser.
            We use public APIs to fetch video information and provide download links. Your data never
            touches our servers.
          </p>
          <ul>
            <li>Paste any supported video URL</li>
            <li>Our system fetches available download options</li>
            <li>Choose your preferred quality</li>
            <li>Download directly to your device</li>
          </ul>

          <h2>Supported Platforms</h2>
          <p>Download King supports a wide range of platforms including:</p>
          <ul>
            <li>YouTube (videos, shorts, playlists)</li>
            <li>Instagram (reels, stories, posts, IGTV)</li>
            <li>Twitter/X (videos, GIFs)</li>
            <li>TikTok (videos without watermark)</li>
            <li>Facebook (videos, reels)</li>
            <li>Vimeo, Dailymotion, Twitch, and more</li>
          </ul>

          <h2 id="privacy">Privacy Policy</h2>
          <p>Your privacy is important to us. Here's how we handle your data:</p>
          <ul>
            <li>
              <strong>No Data Collection:</strong> We do not collect, store, or share any personal information.
            </li>
            <li>
              <strong>Client-Side Processing:</strong> All video processing happens in your browser.
              URLs you enter are sent directly to third-party APIs, not through our servers.
            </li>
            <li>
              <strong>Local Storage Only:</strong> Any cookies you provide for downloading private content
              are stored locally in your browser's localStorage. We cannot access this data.
            </li>
            <li>
              <strong>No Tracking:</strong> We do not use analytics, tracking pixels, or any form of user tracking.
            </li>
            <li>
              <strong>No Cookies:</strong> Our website does not set any cookies except for your theme preference.
            </li>
          </ul>

          <h2 id="terms">Terms of Service</h2>
          <p>By using Download King, you agree to the following terms:</p>
          <ul>
            <li>
              <strong>Personal Use:</strong> This service is intended for personal, non-commercial use only.
            </li>
            <li>
              <strong>Copyright Compliance:</strong> You are responsible for ensuring you have the right
              to download any content. Do not download copyrighted material without permission.
            </li>
            <li>
              <strong>No Redistribution:</strong> Downloaded content should not be redistributed, sold,
              or used for commercial purposes without appropriate rights.
            </li>
            <li>
              <strong>Service Availability:</strong> We provide this service as-is and cannot guarantee
              100% uptime or compatibility with all videos.
            </li>
            <li>
              <strong>Third-Party APIs:</strong> We rely on third-party services to process downloads.
              These services may have their own terms and limitations.
            </li>
          </ul>

          <h2>Fair Use Guidelines</h2>
          <p>Please respect content creators and use this tool responsibly:</p>
          <ul>
            <li>Only download content you have permission to save</li>
            <li>Give credit to original creators when sharing</li>
            <li>Support creators by watching content on their platforms</li>
            <li>Do not use downloaded content for commercial purposes</li>
          </ul>

          <h2>Cookie Usage for Private Content</h2>
          <p>
            Some content requires authentication to access (private videos, age-restricted content, etc.).
            Download King allows you to provide your browser cookies to access such content. Important notes:
          </p>
          <ul>
            <li>Cookies are stored only in your browser's local storage</li>
            <li>We never transmit your cookies to our servers</li>
            <li>Cookies are sent directly to the download API from your browser</li>
            <li>You can clear your cookies at any time from the cookie management section</li>
            <li>Never share your cookies with others</li>
          </ul>

          <h2>Disclaimer</h2>
          <p>
            Download King is not affiliated with YouTube, Instagram, Twitter, TikTok, or any other platform.
            All trademarks belong to their respective owners.
          </p>
          <p>
            This tool is provided for educational and personal use purposes. The developers are not
            responsible for any misuse of this service or any copyright infringement by users.
          </p>

          <h2>Open Source</h2>
          <p>
            Download King is built using open-source technologies including React, React Router,
            and the Cobalt API. We believe in transparency and community-driven development.
          </p>
        </div>
      </div>
    </section>
  )
}

export default About
