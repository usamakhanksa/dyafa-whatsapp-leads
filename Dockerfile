FROM node:20-alpine

# Install Chrome + dependencies for whatsapp-web.js
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

# This line is the fix (uses npm install instead of npm ci)
RUN npm install --production

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
