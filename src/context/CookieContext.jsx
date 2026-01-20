import { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from './ToastContext'

const CookieContext = createContext(null)

export function CookieProvider({ children }) {
  const [cookies, setCookies] = useState('')
  const { showToast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem('userCookies')
    if (saved) {
      setCookies(saved)
    }
  }, [])

  const saveCookies = (value) => {
    if (value.trim()) {
      localStorage.setItem('userCookies', value.trim())
      setCookies(value.trim())
      showToast('Cookies saved successfully!', 'success')
    } else {
      showToast('Please enter cookies first', 'error')
    }
  }

  const clearCookies = () => {
    localStorage.removeItem('userCookies')
    setCookies('')
    showToast('Cookies cleared', 'success')
  }

  const getCookies = () => {
    return localStorage.getItem('userCookies') || ''
  }

  return (
    <CookieContext.Provider value={{ cookies, setCookies, saveCookies, clearCookies, getCookies }}>
      {children}
    </CookieContext.Provider>
  )
}

export function useCookies() {
  const context = useContext(CookieContext)
  if (!context) {
    throw new Error('useCookies must be used within a CookieProvider')
  }
  return context
}
