const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const qrcode = require('qrcode');
const dotenv = require('dotenv');
const { Client, LocalAuth } = require('whatsapp-web.js');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const MY_WHATSAPP_NUMBER = process.env.MY_WHATSAPP_NUMBER || '966510451995';
const PORT = process.env.PORT || 8080;

let lastQrDataUrl = null;
let clientReady = false;

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'dyafa-leads' }),
  puppeteer: {
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', async (qr) => {
  lastQrDataUrl = await qrcode.toDataURL(qr);
  console.log('✅ QR Ready → Visit /qr');
});

client.on('ready', () => {
  clientReady = true;
  console.log('🎉 WhatsApp Connected Successfully!');
});

client.on('authenticated', () => console.log('✅ Authenticated'));
client.on('auth_failure', (msg) => console.error('❌ Auth failure:', msg));

app.post('/send-message', async (req, res) => {
  const { message, visitorName = 'Visitor', visitorPhone = '' } = req.body;
  if (!message) return res.status(400).json({ success: false, error: 'Message required' });

  if (!clientReady) return res.status(503).json({ success: false, error: 'Scan QR first at /qr' });

  try {
    const to = `${MY_WHATSAPP_NUMBER}@c.us`;
    const text = `📩 *New Dyafa Lead*\n\n👤 Name: ${visitorName}\n📱 Phone: ${visitorPhone}\n💬 Message: ${message}\n⏰ ${new Date().toLocaleString()}`;
    await client.sendMessage(to, text);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get('/qr', (req, res) => {
  if (clientReady) return res.send('<h2 style="color:green;text-align:center;margin:50px">✅ Already Connected</h2>');
  if (!lastQrDataUrl) return res.send('<h3 style="text-align:center;margin:50px">⌛ Loading QR...</h3>');
  res.send(`<h2 style="text-align:center;color:#25D366">Scan this QR</h2><img src="${lastQrDataUrl}" style="max-width:400px">`);
});

app.get('/status', (req, res) => res.json({ ready: clientReady }));

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await client.initialize();
});
