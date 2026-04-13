FROM node:20-alpine

# Install system dependencies for Chrome / Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm

# Set Chrome path for whatsapp-web.js
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

# Expose Railway port
EXPOSE 8080

CMD ["node", "server.js"]
