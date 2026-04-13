# Dyafa WhatsApp Leads

One-time QR scan → All website messages come to your WhatsApp.

**Live Test:** `/test-chat.html`

## How to Run Locally
1. `npm install`
2. Copy `.env.example` → `.env`
3. `npm start`
4. Open http://localhost:3000/qr → scan once

## Deploy to Railway (Free)
1. Push this repo to GitHub
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Add environment variable `MY_WHATSAPP_NUMBER=966510451995`
4. Done — your server will be live 24/7

## Important: GitHub Pages vs Backend Server
GitHub Pages cannot run this app's Express routes (`/qr`, `/send-message`, `/status`) because Pages only serves static files.

Use your backend host (Railway/Render/etc.) for QR scanning, for example:
- `https://<your-backend-domain>/qr`

If you open the Pages URL by mistake, `/qr` now shows a helper page where you can pass your backend host via query string:
- `https://<username>.github.io/dyafa-whatsapp-leads/qr/?backend=https://<your-backend-domain>`

