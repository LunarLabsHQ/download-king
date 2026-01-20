import { useState } from 'react'
import { useCookies } from '../context/CookieContext'

function CookieManager({ platform = "the website" }) {
  const [isOpen, setIsOpen] = useState(false)
  const { cookies, setCookies, saveCookies, clearCookies } = useCookies()

  const toggleForm = () => {
    setIsOpen(!isOpen)
  }

  const handleSave = () => {
    saveCookies(cookies)
  }

  const handleClear = () => {
    clearCookies()
  }

  return (
    <section className="cookie-section">
      <div className="container">
        <h2 className="section-title">Download Private/Protected Content</h2>
        <div className="cookie-content">
          <div className="cookie-info">
            <p>
              To download private, unlisted, or age-restricted content from {platform},
              you need to provide your browser cookies.
            </p>
            <button className="btn-secondary" onClick={toggleForm}>
              <span>📋</span> Manage Cookies
            </button>
          </div>

          {isOpen && (
            <div className="cookie-form active">
              <h3>How to Get Your Cookies</h3>
              <ol className="cookie-steps">
                <li>Install "Get cookies.txt LOCALLY" browser extension</li>
                <li>Go to {platform} and make sure you're logged in</li>
                <li>Click the extension icon and export cookies</li>
                <li>Paste the exported cookies below</li>
              </ol>
              <textarea
                value={cookies}
                onChange={(e) => setCookies(e.target.value)}
                className="cookies-textarea"
                placeholder={`Paste your ${platform} cookies here in Netscape format...`}
                rows={6}
              />
              <div className="cookie-actions">
                <button className="btn-primary" onClick={handleSave}>
                  Save Cookies
                </button>
                <button className="btn-outline" onClick={handleClear}>
                  Clear Cookies
                </button>
              </div>
              <p className="cookie-note">
                ⚠️ Your cookies are stored locally in your browser and never sent to our servers.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CookieManager
