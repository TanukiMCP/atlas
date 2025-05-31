const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const path = require('path');

// For production, use a real cert. For dev, use self-signed.
const server = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
});

const wss = new WebSocket.Server({ server });

// token -> { host: ws, client: ws, expires: number }
const sessions = new Map();
const TOKEN_TTL = 10 * 60 * 1000; // 10 minutes

wss.on('connection', (ws, req) => {
  let role = null;
  let token = null;
  let paired = false;
  let peer = null;
  let timeout = null;

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      if (data.type === 'register-host' && data.token) {
        role = 'host';
        token = data.token;
        sessions.set(token, { host: ws, client: null, expires: Date.now() + TOKEN_TTL });
        ws.send(JSON.stringify({ type: 'host-registered' }));
        timeout = setTimeout(() => ws.close(4001, 'Token expired'), TOKEN_TTL);
        console.log(`[Relay] Host registered for token ${token}`);
      } else if (data.type === 'register-client' && data.token) {
        role = 'client';
        token = data.token;
        const session = sessions.get(token);
        if (session && session.host && !session.client && session.expires > Date.now()) {
          session.client = ws;
          peer = session.host;
          peer.send(JSON.stringify({ type: 'client-connected' }));
          ws.send(JSON.stringify({ type: 'client-registered' }));
          paired = true;
          // Bridge messages
          ws.on('message', (m) => peer.readyState === WebSocket.OPEN && peer.send(m));
          peer.on('message', (m) => ws.readyState === WebSocket.OPEN && ws.send(m));
          console.log(`[Relay] Client paired for token ${token}`);
        } else {
          ws.send(JSON.stringify({ type: 'error', error: 'Invalid or expired token' }));
          ws.close(4002, 'Invalid or expired token');
        }
      }
    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', error: 'Malformed message' }));
    }
  });

  ws.on('close', () => {
    if (role === 'host' && token) {
      const session = sessions.get(token);
      if (session && session.host === ws) {
        if (session.client) session.client.close(4000, 'Host disconnected');
        sessions.delete(token);
      }
    } else if (role === 'client' && token) {
      const session = sessions.get(token);
      if (session && session.client === ws) {
        if (session.host) session.host.close(4000, 'Client disconnected');
        sessions.delete(token);
      }
    }
    if (timeout) clearTimeout(timeout);
    console.log(`[Relay] ${role || 'unknown'} disconnected for token ${token}`);
  });
});

server.listen(8443, () => {
  console.log('Relay server running on wss://localhost:8443');
}); 