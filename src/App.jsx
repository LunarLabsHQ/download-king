import { Routes, Route } from 'react-router-dom'
import { useTheme } from './context/ThemeContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Toast from './components/Toast'
import Home from './pages/Home'
import YouTube from './pages/YouTube'
import Instagram from './pages/Instagram'
import Twitter from './pages/Twitter'
import About from './pages/About'

function App() {
  const { theme } = useTheme()

  return (
    <div className="app" data-theme={theme}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/youtube" element={<YouTube />} />
          <Route path="/instagram" element={<Instagram />} />
          <Route path="/twitter" element={<Twitter />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </div>
  )
}

export default App
