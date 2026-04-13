FROM node:20-alpine

# Install all required system libraries for Chrome/Puppeteer on Alpine
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

COPY package*.json ./

# Use npm install (works without package-lock.json)
RUN npm install --production

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
