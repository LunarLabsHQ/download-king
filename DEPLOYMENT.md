# Deployment Guide - Download King

This guide will walk you through deploying the Download King application with the backend on Digital Ocean and the frontend on Vercel.

---

## Table of Contents
- [Backend Deployment (Digital Ocean)](#backend-deployment-digital-ocean)
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Post-Deployment Configuration](#post-deployment-configuration)

---

## Backend Deployment (Digital Ocean)

### Prerequisites
- Digital Ocean account ([Sign up here](https://www.digitalocean.com/))
- SSH key set up in your Digital Ocean account
- Domain name (optional but recommended)

### Step 1: Create a Droplet

1. **Log in to Digital Ocean** and click **"Create"** → **"Droplets"**

2. **Choose an image:**
   - Select **Ubuntu 22.04 LTS** (recommended)

3. **Choose a plan:**
   - Basic plan
   - Regular CPU
   - **Minimum:** $6/month (1GB RAM, 1 CPU)
   - **Recommended:** $12/month (2GB RAM, 1 CPU) for better performance

4. **Choose a datacenter region:**
   - Select the region closest to your target audience

5. **Authentication:**
   - Choose **SSH Key** (recommended) or **Password**

6. **Additional options:**
   - Enable **Monitoring** (free)

7. **Finalize:**
   - Give your droplet a hostname (e.g., `download-king-server`)
   - Click **"Create Droplet"**

### Step 2: Connect to Your Droplet

```bash
ssh root@YOUR_DROPLET_IP
```

### Step 3: Initial Server Setup

```bash
# Update system packages
apt update && apt upgrade -y

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Python and pip
apt install -y python3 python3-pip

# Install ffmpeg (required for yt-dlp)
apt install -y ffmpeg

# Verify installations
node --version
python3 --version
ffmpeg -version
```

### Step 4: Install yt-dlp

```bash
# Install yt-dlp via pip
pip3 install -U yt-dlp

# Verify installation
yt-dlp --version
```

### Step 5: Set Up Application Directory

```bash
# Create app directory
mkdir -p /var/www/download-king
cd /var/www/download-king

# Create server directory
mkdir server
cd server
```

### Step 6: Upload Server Files

**Option A: Using Git (Recommended)**

```bash
# Install git if not already installed
apt install -y git

# Clone your repository (replace with your repo URL)
cd /var/www/download-king
git clone YOUR_REPOSITORY_URL .

# Navigate to server directory
cd server
```

**Option B: Using SCP (from your local machine)**

```bash
# From your local machine, upload the server folder
scp -r server root@YOUR_DROPLET_IP:/var/www/download-king/
```

### Step 7: Install Dependencies

```bash
cd /var/www/download-king/server

# Install Node.js dependencies
npm install
```

### Step 8: Configure Environment

```bash
# Create .env file
nano .env
```

Add the following:
```env
PORT=3001
NODE_ENV=production
```

Save and exit (Ctrl+X, then Y, then Enter)

### Step 9: Set Up PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start the server with PM2
pm2 start server.js --name "download-king"

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Copy and run the command it outputs
```

### Step 10: Configure Firewall

```bash
# Set up UFW firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3001/tcp
ufw enable
```

### Step 11: Set Up Nginx as Reverse Proxy

```bash
# Install Nginx
apt install -y nginx

# Create Nginx configuration
nano /etc/nginx/sites-available/download-king
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # Increase timeouts for large file downloads
    proxy_connect_timeout 300;
    proxy_send_timeout 300;
    proxy_read_timeout 300;
    send_timeout 300;

    # Increase buffer sizes
    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Disable buffering for downloads
        proxy_buffering off;
    }
}
```

Save and exit.

```bash
# Enable the site
ln -s /etc/nginx/sites-available/download-king /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 12: Set Up SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

### Step 13: Monitor Your Server

```bash
# View PM2 logs
pm2 logs download-king

# Check server status
pm2 status

# Restart server if needed
pm2 restart download-king
```

### Step 14: Update yt-dlp Regularly

```bash
# Create a cron job to update yt-dlp weekly
crontab -e

# Add this line to update every Sunday at 2 AM
0 2 * * 0 pip3 install -U yt-dlp
```

---

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account ([Sign up here](https://vercel.com/signup))
- GitHub, GitLab, or Bitbucket account

### Step 1: Prepare Your Repository

1. **Create a GitHub repository** (if you haven't already)
2. **Push your code** to the repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Update API URL

Before deploying, update your frontend to use the production backend URL.

**Create `.env.production` file in the root directory:**

```env
VITE_API_URL=https://your-domain.com
```

Or update your API configuration file to use the environment variable:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
```

**Commit and push:**
```bash
git add .env.production
git commit -m "Add production API URL"
git push
```

### Step 3: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended for beginners)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "Add New Project"**

3. **Import your Git repository:**
   - Connect your GitHub account if not already connected
   - Select your repository

4. **Configure project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. **Environment Variables:**
   - Add `VITE_API_URL` with value `https://your-backend-domain.com`

6. **Click "Deploy"**

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - What's your project's name? download-king
# - In which directory is your code located? ./
# - Want to override the settings? No

# Deploy to production
vercel --prod
```

### Step 4: Configure Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add the following:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-domain.com` (your Digital Ocean backend URL)
   - **Environment:** Production
4. Click **"Save"**
5. Redeploy by clicking **"Deployments"** → **"..."** → **"Redeploy"**

### Step 5: Configure Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow the instructions to update your DNS settings

---

## Post-Deployment Configuration

### Update CORS Settings

On your backend server, update CORS to allow your frontend domain:

```bash
ssh root@YOUR_DROPLET_IP
cd /var/www/download-king/server
nano server.js
```

Update the CORS configuration:

```javascript
// Replace
app.use(cors())

// With
app.use(cors({
  origin: [
    'https://your-vercel-domain.vercel.app',
    'https://your-custom-domain.com'
  ]
}))
```

Restart the server:
```bash
pm2 restart download-king
```

### Update Frontend API Configuration

If you haven't already, ensure your frontend uses the production API URL:

**In your API configuration file or .env:**
```env
VITE_API_URL=https://your-backend-domain.com
```

**Commit and push:**
```bash
git add .
git commit -m "Update API URL for production"
git push
```

Vercel will automatically redeploy.

---

## Testing Your Deployment

### Test Backend

```bash
# Health check
curl https://your-backend-domain.com/api/health

# Should return: {"status":"ok","service":"Download King Server"}
```

### Test Frontend

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Try downloading a video
3. Check browser console for any errors

---

## Maintenance & Monitoring

### Backend Monitoring

```bash
# SSH into your droplet
ssh root@YOUR_DROPLET_IP

# Check PM2 status
pm2 status

# View logs
pm2 logs download-king

# Check disk space (important for downloads folder)
df -h

# Check memory usage
free -h

# Restart if needed
pm2 restart download-king
```

### Update Application

**Backend:**
```bash
ssh root@YOUR_DROPLET_IP
cd /var/www/download-king
git pull
cd server
npm install
pm2 restart download-king
```

**Frontend:**
Simply push to your Git repository - Vercel will auto-deploy.

### Clean Up Old Files

The server automatically cleans files older than 30 minutes, but you can manually clean:

```bash
cd /var/www/download-king/server
rm -rf downloads/*
rm -rf temp/*
```

---

## Troubleshooting

### Backend Issues

**Server not responding:**
```bash
pm2 status
pm2 logs download-king
systemctl status nginx
```

**yt-dlp errors:**
```bash
pip3 install -U yt-dlp
pm2 restart download-king
```

**Disk space full:**
```bash
df -h
cd /var/www/download-king/server
rm -rf downloads/*
rm -rf temp/*
```

### Frontend Issues

**API calls failing:**
- Check CORS settings on backend
- Verify VITE_API_URL in Vercel environment variables
- Check browser console for errors

**Build failing:**
- Check Vercel build logs
- Verify package.json scripts
- Check for missing dependencies

---

## Security Best Practices

1. **Keep system updated:**
   ```bash
   apt update && apt upgrade -y
   ```

2. **Use strong passwords/SSH keys**

3. **Keep yt-dlp updated:**
   ```bash
   pip3 install -U yt-dlp
   ```

4. **Monitor server logs regularly:**
   ```bash
   pm2 logs
   ```

5. **Set up automated backups** in Digital Ocean

6. **Use environment variables** for sensitive data

7. **Enable HTTPS** with Let's Encrypt (covered in Step 12)

8. **Limit CORS** to your specific domains

---

## Cost Estimates

### Digital Ocean
- **Basic Droplet:** $6-12/month
- **Bandwidth:** 1-2TB included (usually sufficient)
- **Total:** ~$6-15/month

### Vercel
- **Hobby Plan:** Free (suitable for most use cases)
- **Pro Plan:** $20/month (if you need more bandwidth/features)

### Total Estimated Cost: $6-35/month

---

## Support & Resources

- **Digital Ocean Docs:** https://docs.digitalocean.com/
- **Vercel Docs:** https://vercel.com/docs
- **yt-dlp GitHub:** https://github.com/yt-dlp/yt-dlp
- **PM2 Docs:** https://pm2.keymetrics.io/

---

## Quick Reference Commands

### Backend (Digital Ocean)
```bash
# SSH into server
ssh root@YOUR_DROPLET_IP

# Check status
pm2 status

# View logs
pm2 logs download-king

# Restart server
pm2 restart download-king

# Update yt-dlp
pip3 install -U yt-dlp

# Check disk space
df -h
```

### Frontend (Vercel)
```bash
# Deploy from CLI
vercel --prod

# View logs
vercel logs
```

---

## Congratulations!

Your Download King application is now live! 🎉

- **Frontend:** https://your-project.vercel.app
- **Backend:** https://your-backend-domain.com
- **API Health:** https://your-backend-domain.com/api/health

Make sure to test thoroughly and monitor your server regularly!
