import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <span className="logo-icon">👑</span>
              <span className="logo-text">Download King</span>
            </Link>
            <p>The ultimate free video downloader for all your favorite platforms.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Platforms</h4>
              <ul>
                <li><Link to="/youtube">YouTube</Link></li>
                <li><Link to="/instagram">Instagram</Link></li>
                <li><Link to="/twitter">Twitter/X</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/about#privacy">Privacy Policy</Link></li>
                <li><Link to="/about#terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Download King. All rights reserved.</p>
          <p className="disclaimer">This tool is for personal use only. Please respect copyright laws.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
