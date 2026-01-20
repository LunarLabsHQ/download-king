/**
 * Download King Backend Server
 * Uses yt-dlp for reliable video downloads
 */

import express from 'express'
import cors from 'cors'
import { spawn } from 'child_process'
import { writeFileSync, unlinkSync, existsSync, mkdirSync, createReadStream, statSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3001

// Middleware
app.use(cors({
  origin: '*', // Allow all origins (restrict in production)
  credentials: true,
  exposedHeaders: ['Content-Disposition', 'Content-Length', 'Content-Type']
}))
app.use(express.json())

// Directories
const TEMP_DIR = join(__dirname, 'temp')
const DOWNLOADS_DIR = join(__dirname, 'downloads')

// Create directories
for (const dir of [TEMP_DIR, DOWNLOADS_DIR]) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

// Clean old files on startup
function cleanOldFiles() {
  const maxAge = 30 * 60 * 1000 // 30 minutes
  const now = Date.now()

  for (const dir of [TEMP_DIR, DOWNLOADS_DIR]) {
    if (existsSync(dir)) {
      for (const file of readdirSync(dir)) {
        const filePath = join(dir, file)
        try {
          const stat = statSync(filePath)
          if (now - stat.mtimeMs > maxAge) {
            unlinkSync(filePath)
          }
        } catch (e) { }
      }
    }
  }
}
cleanOldFiles()
setInterval(cleanOldFiles, 10 * 60 * 1000) // Clean every 10 minutes

/**
 * Execute yt-dlp command
 */
function runYtDlp(args, timeout = 120000) {
  return new Promise((resolve, reject) => {
    console.log(`[yt-dlp] Running: python -m yt_dlp ${args.join(' ')}`)

    // Use shell: false and pass arguments properly to avoid path escaping issues
    const proc = spawn('python', ['-m', 'yt_dlp', ...args], {
      shell: false,
      windowsHide: true,
      cwd: __dirname
    })

    let stdout = ''
    let stderr = ''

    const timer = setTimeout(() => {
      proc.kill()
      reject(new Error('Request timed out'))
    }, timeout)

    proc.stdout.on('data', (data) => {
      stdout += data.toString()
      console.log(`[yt-dlp] stdout: ${data}`)
    })

    proc.stderr.on('data', (data) => {
      stderr += data.toString()
      console.log(`[yt-dlp] stderr: ${data}`)
    })

    proc.on('close', (code) => {
      clearTimeout(timer)
      if (code === 0) {
        resolve(stdout.trim())
      } else {
        // Extract meaningful error
        let errorMsg = stderr || `Exit code ${code}`
        if (errorMsg.includes('Sign in to confirm your age')) {
          errorMsg = 'This video is age-restricted. Please add your YouTube cookies.'
        } else if (errorMsg.includes('Private video')) {
          errorMsg = 'This is a private video. You need cookies from an account with access.'
        } else if (errorMsg.includes('Video unavailable')) {
          errorMsg = 'This video is unavailable or has been removed.'
        } else if (errorMsg.includes('is not a valid URL')) {
          errorMsg = 'Invalid URL format.'
        }
        reject(new Error(errorMsg))
      }
    })

    proc.on('error', (err) => {
      clearTimeout(timer)
      reject(err)
    })
  })
}

/**
 * Get video info
 */
app.post('/api/info', async (req, res) => {
  try {
    const { url, cookies } = req.body

    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }

    console.log(`[INFO] Fetching: ${url}`)

    const args = ['--dump-json', '--no-warnings', '--no-playlist']

    let cookieFile = null
    let cookieFileFull = null
    if (cookies && cookies.trim()) {
      cookieFile = `temp/cookies_${Date.now()}.txt`
      cookieFileFull = join(__dirname, cookieFile)
      writeFileSync(cookieFileFull, cookies)
      args.push('--cookies', cookieFile)
    }

    args.push(url)

    const output = await runYtDlp(args)

    if (cookieFileFull && existsSync(cookieFileFull)) {
      unlinkSync(cookieFileFull)
    }

    const info = JSON.parse(output)

    res.json({
      status: 'success',
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration,
      uploader: info.uploader,
      url: url,
      filesize: info.filesize || info.filesize_approx,
      formats: info.formats
    })

  } catch (error) {
    console.error('[ERROR]', error.message)
    res.status(400).json({ error: error.message })
  }
})

/**
 * Download video - returns stream URL or downloads file
 */
app.post('/api/download', async (req, res) => {
  try {
    const { url, cookies, audioOnly, quality } = req.body

    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }

    console.log(`[DOWNLOAD] Processing: ${url} - Quality: ${quality || 'best'} - Audio Only: ${audioOnly}`)

    // Generate unique filename - use relative path from server directory
    const fileId = Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
    const ext = audioOnly ? 'mp3' : 'mp4'
    const outputTemplate = `downloads/${fileId}.%(ext)s`

    // Build download arguments with optimization flags
    const args = [
      '--no-warnings',
      '--no-playlist',
      '--no-check-certificates',  // Skip SSL verification for speed
      '--prefer-free-formats',    // Prefer formats that don't need conversion
      '--concurrent-fragments', '4', // Download 4 fragments in parallel
      '-o', outputTemplate
    ]

    if (audioOnly) {
      args.push('-f', 'bestaudio')
      args.push('-x', '--audio-format', 'mp3')
    } else {
      // Format selection for FAST downloads - prefer pre-encoded MP4 with H.264
      // This avoids re-encoding which is MUCH faster
      let formatStr = ''

      switch(quality) {
        case '360':
          // Prefer MP4 container with H.264 codec already encoded
          formatStr = 'bestvideo[height<=360][ext=mp4][vcodec^=avc1]+bestaudio[ext=m4a]/bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=360][vcodec^=avc1]+bestaudio/best[height<=360][ext=mp4]/best[height<=360]'
          break
        case '480':
          formatStr = 'bestvideo[height<=480][ext=mp4][vcodec^=avc1]+bestaudio[ext=m4a]/bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=480][vcodec^=avc1]+bestaudio/best[height<=480][ext=mp4]/best[height<=480]'
          break
        case '720':
          formatStr = 'bestvideo[height<=720][ext=mp4][vcodec^=avc1]+bestaudio[ext=m4a]/bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=720][vcodec^=avc1]+bestaudio/best[height<=720][ext=mp4]/best[height<=720]'
          break
        case '1080':
          formatStr = 'bestvideo[height<=1080][ext=mp4][vcodec^=avc1]+bestaudio[ext=m4a]/bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=1080][vcodec^=avc1]+bestaudio/best[height<=1080][ext=mp4]/best[height<=1080]'
          break
        default:
          // Best quality - prefer already encoded MP4
          formatStr = 'bestvideo[ext=mp4][vcodec^=avc1]+bestaudio[ext=m4a]/bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'
      }

      args.push('-f', formatStr)
      args.push('--merge-output-format', 'mp4')

      // Only recode if the format is incompatible (much faster than always re-encoding)
      args.push('--recode-video', 'mp4')
    }

    // Handle cookies - use relative path
    let cookieFile = null
    let cookieFileFull = null
    if (cookies && cookies.trim()) {
      cookieFile = `temp/cookies_${Date.now()}.txt`
      cookieFileFull = join(__dirname, cookieFile)
      writeFileSync(cookieFileFull, cookies)
      args.push('--cookies', cookieFile)
    }

    args.push(url)

    await runYtDlp(args, 300000) // 5 minute timeout for download

    if (cookieFileFull && existsSync(cookieFileFull)) {
      unlinkSync(cookieFileFull)
    }

    // Find the downloaded file
    const files = readdirSync(DOWNLOADS_DIR).filter(f => f.startsWith(fileId))
    if (files.length === 0) {
      throw new Error('Download failed - file not created')
    }

    let downloadedFile = files[0]
    const originalFilePath = join(DOWNLOADS_DIR, downloadedFile)

    const downloadUrl = `/api/file/${downloadedFile}`

    res.json({
      status: 'success',
      url: `http://api.downloadking.xyz`,
      filename: downloadedFile
    })

  } catch (error) {
    console.error('[ERROR]', error.message)
    res.status(400).json({ error: error.message })
  }
})

/**
 * Quick download - just get direct URL (faster but may not work for all videos)
 */
app.post('/api/quick', async (req, res) => {
  try {
    const { url, cookies, audioOnly } = req.body

    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }

    console.log(`[QUICK] Getting URL for: ${url}`)

    const args = ['--get-url', '--no-warnings', '--no-playlist']

    if (audioOnly) {
      args.push('-f', 'bestaudio')
    } else {
      // Try to get a format that works for streaming
      args.push('-f', 'best[ext=mp4]/best')
    }

    let cookieFile = null
    let cookieFileFull = null
    if (cookies && cookies.trim()) {
      cookieFile = `temp/cookies_${Date.now()}.txt`
      cookieFileFull = join(__dirname, cookieFile)
      writeFileSync(cookieFileFull, cookies)
      args.push('--cookies', cookieFile)
    }

    args.push(url)

    const downloadUrl = await runYtDlp(args)

    if (cookieFileFull && existsSync(cookieFileFull)) {
      unlinkSync(cookieFileFull)
    }

    const finalUrl = downloadUrl.split('\n')[0]

    res.json({
      status: 'success',
      url: finalUrl
    })

  } catch (error) {
    console.error('[ERROR]', error.message)
    res.status(400).json({ error: error.message })
  }
})

/**
 * Serve downloaded files and delete after sending
 */
app.get('/api/file/:filename', (req, res) => {
  const { filename } = req.params
  const filePath = join(DOWNLOADS_DIR, filename)

  if (!existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' })
  }

  const stat = statSync(filePath)
  const ext = filename.split('.').pop().toLowerCase()
  const contentType = ext === 'mp3' ? 'audio/mpeg' : 'video/mp4'

  // Set headers to force download
  res.setHeader('Content-Type', contentType)
  res.setHeader('Content-Length', stat.size)
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')

  const stream = createReadStream(filePath)
  let isDeleted = false

  // Function to delete file (only once)
  const deleteFile = () => {
    if (isDeleted) return
    isDeleted = true

    console.log(`[CLEANUP] Deleting file after download: ${filename}`)
    setTimeout(() => {
      try {
        if (existsSync(filePath)) {
          unlinkSync(filePath)
          console.log(`[CLEANUP] File deleted: ${filename}`)
        }
      } catch (error) {
        console.error(`[ERROR] Failed to delete file ${filename}:`, error.message)
      }
    }, 1000) // Wait 1 second to ensure stream is closed
  }

  // Delete file when response finishes (successful download)
  res.on('finish', deleteFile)

  // Delete file when connection is closed (user cancelled/completed)
  res.on('close', deleteFile)

  // Handle stream errors
  stream.on('error', (error) => {
    console.error(`[ERROR] Stream error for ${filename}:`, error.message)
    deleteFile()
  })

  // Pipe stream to response
  stream.pipe(res)
})

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Download King Server' })
})

/**
 * Root route
 */
app.get('/', (req, res) => {
  res.json({
    service: 'Download King Server',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      info: 'POST /api/info',
      download: 'POST /api/download',
      quick: 'POST /api/quick',
      health: 'GET /api/health'
    }
  })
})

/**
 * Catch-all for unmatched routes
 */
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` })
})

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║         Download King Server Running!             ║
  ║         http://localhost:${PORT}                      ║
  ║                                                   ║
  ║  Endpoints:                                       ║
  ║  POST /api/info     - Get video info              ║
  ║  POST /api/download - Download video (reliable)   ║
  ║  POST /api/quick    - Get direct URL (fast)       ║
  ║  GET  /api/health   - Health check                ║
  ╚═══════════════════════════════════════════════════╝
  `)
})
