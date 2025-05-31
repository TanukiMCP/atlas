import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './mobile.css';

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
}

// Connection context types
interface ConnectionState {
  token: string;
  relay: string;
  ws: WebSocket | null;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  error: string | null;
}
interface ConnectionContextType {
  connection: ConnectionState | null;
  setConnection: React.Dispatch<React.SetStateAction<ConnectionState | null>>;
}
const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);
const useConnection = () => {
  const ctx = useContext(ConnectionContext);
  if (!ctx) throw new Error('useConnection must be used within ConnectionProvider');
  return ctx;
};

const MobileSplash = () => {
  const navigate = useNavigate();
  useEffect(() => { registerServiceWorker(); }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 safe-bottom">
      <div className="text-6xl mb-4" aria-label="TanukiMCP Logo">🦝</div>
      <h1 className="text-2xl font-bold mb-2">TanukiMCP Atlas Mobile</h1>
      <p className="mb-8 text-center text-muted-foreground">Your AI companion, anywhere.</p>
      <button className="w-full max-w-xs py-3 mb-4 rounded-lg bg-primary text-white font-semibold text-lg shadow hover:bg-primary/90 transition focus-visible" aria-label="Connect to Desktop Atlas" onClick={() => navigate('/mobile/scan')}>Connect to Desktop Atlas</button>
      <button className="w-full max-w-xs py-3 rounded-lg border border-border text-lg font-semibold bg-background hover:bg-muted transition focus-visible" aria-label="Continue in Local Mode" onClick={() => navigate('/mobile/local')}>Continue in Local Mode</button>
      <div className="mt-8 text-sm text-muted-foreground">New to TanukiMCP Atlas? <a href="#" className="underline">Learn More →</a></div>
    </div>
  );
};

const QrScannerScreen = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  const { setConnection } = useConnection();

  useEffect(() => {
    let stream: MediaStream | null = null;
    let stopped = false;
    let codeReader: any = null;
    (async () => {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser');
        codeReader = new BrowserMultiFormatReader();
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();
        }
        const result = await codeReader.decodeOnceFromVideoElement(videoRef.current!);
        if (!stopped) {
          setScanning(false);
          // Validate QR code (should be tanukimcp://connect?...)
          if (result.text.startsWith('tanukimcp://connect?')) {
            try {
              const url = new URL(result.text);
              const token = url.searchParams.get('token');
              const relay = url.searchParams.get('relay');
              if (token && relay) {
                setConnection({ token, relay, ws: null, status: 'connecting', error: null });
                navigate('/mobile/connecting');
              } else {
                setError('QR code missing token or relay info.');
              }
            } catch (e) {
              setError('Invalid QR code format.');
            }
          } else {
            setError('Invalid QR code. Please scan a TanukiMCP connection code.');
          }
        }
      } catch (err) {
        setError('Camera or QR scanning failed.');
      }
      return () => {
        stopped = true;
        if (codeReader) codeReader.reset();
        if (stream) stream.getTracks().forEach(t => t.stop());
      };
    })();
    return () => {
      stopped = true;
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [navigate, setConnection]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-foreground p-4 safe-bottom">
      <div className="w-full flex items-center mb-2">
        <button className="text-lg focus-visible" aria-label="Back" onClick={() => navigate(-1)}>← Back</button>
      </div>
      <h2 className="text-xl font-bold mb-2">Scan Desktop QR Code</h2>
      <div className="w-full max-w-xs aspect-square bg-black rounded-lg overflow-hidden flex items-center justify-center mb-4">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline aria-label="QR Scanner" />
        {scanning && <div className="absolute w-full h-full flex items-center justify-center"><div className="border-4 border-primary rounded-lg w-4/5 h-4/5 animate-pulse"></div></div>}
      </div>
      <p className="mb-4 text-center text-muted-foreground">Position the QR code from your desktop Atlas application in the viewfinder</p>
      {error && <div className="text-red-500 mb-2" role="alert">{error}</div>}
      <button className="w-full max-w-xs py-3 rounded-lg border border-border text-lg font-semibold bg-background hover:bg-muted transition mb-2 focus-visible" aria-label="Enter Code Manually" onClick={() => navigate('/mobile/manual')}>Enter Code Manually</button>
    </div>
  );
};

const ConnectingScreen = () => {
  const navigate = useNavigate();
  const { connection, setConnection } = useConnection();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!connection?.token || !connection?.relay) {
      setError('Missing connection info.');
      setLoading(false);
      return;
    }
    let ws;
    try {
      ws = new WebSocket(connection.relay.replace(/^http/, 'ws'));
      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'register-client', token: connection.token }));
      };
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === 'client-registered') {
          setConnection({ ...connection, ws, status: 'connected', error: null });
          setLoading(false);
          navigate('/mobile/success');
        } else if (msg.type === 'error') {
          setError(msg.error || 'Connection error.');
          setLoading(false);
          ws.close();
        }
      };
      ws.onerror = () => {
        setError('WebSocket error.');
        setLoading(false);
      };
      ws.onclose = () => {
        if (!error) setError('Connection closed.');
        setLoading(false);
      };
    } catch (e) {
      setError('Failed to connect to relay.');
      setLoading(false);
    }
    return () => {
      if (ws) ws.close();
    };
  }, [connection, setConnection, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="text-4xl mb-4 animate-spin">🔄</div>
      <h2 className="text-xl font-bold mb-2">Connecting to Desktop...</h2>
      {loading && <div className="mb-4 text-center">Establishing secure connection...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {!loading && <button className="w-full max-w-xs py-3 rounded-lg border border-border text-lg font-semibold bg-background hover:bg-muted transition" onClick={() => navigate('/mobile/scan')}>Back</button>}
    </div>
  );
};

const ConnectionSuccessScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="text-6xl mb-4">✓</div>
      <h2 className="text-xl font-bold mb-2">Connection Successful!</h2>
      <div className="mb-4 text-center">Connected to: Atlas Desktop<br />Connection details: <br />• Local Network or Relay<br />• AES-256 Encrypted<br />• File Systems: Isolated</div>
      <button className="w-full max-w-xs py-3 rounded-lg bg-primary text-white font-semibold text-lg shadow hover:bg-primary/90 transition" onClick={() => navigate('/mobile/chat')}>Continue to Chat</button>
    </div>
  );
};

const LocalModeScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
    <div className="text-6xl mb-4">🦝</div>
    <h2 className="text-xl font-bold mb-2">Local Mode</h2>
    <p className="mb-8 text-center text-muted-foreground">You are running in offline/local mode. Some features may be limited.</p>
    <button className="w-full max-w-xs py-3 rounded-lg bg-primary text-white font-semibold text-lg shadow hover:bg-primary/90 transition mb-2">Start Chatting</button>
    <button className="w-full max-w-xs py-3 rounded-lg border border-border text-lg font-semibold bg-background hover:bg-muted transition">Back</button>
  </div>
);

const ChatScreen = () => {
  const { connection, setConnection } = useConnection();
  const [messages, setMessages] = useState<{ sender: 'user' | 'desktop', text?: string; ts: number; media?: { type: string; data: string; name?: string } }[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<'connected' | 'reconnecting' | 'disconnected'>('connected');
  const [error, setError] = useState<string | null>(null);
  const [mediaPreview, setMediaPreview] = useState<{ type: string; data: string; name?: string } | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // WebSocket message handling
  useEffect(() => {
    if (!connection?.ws) return;
    wsRef.current = connection.ws;
    setStatus('connected');
    setError(null);
    const ws = wsRef.current;
    const onMessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'chat' && typeof msg.text === 'string') {
          setMessages((prev) => [...prev, { sender: 'desktop', text: msg.text, ts: Date.now() }]);
        } else if (msg.type === 'media' && msg.media) {
          setMessages((prev) => [...prev, { sender: 'desktop', ts: Date.now(), media: msg.media }]);
        }
      } catch {}
    };
    const onClose = () => {
      setStatus('disconnected');
      setError('Connection lost. Trying to reconnect...');
      // Try to reconnect
      let attempts = 0;
      const tryReconnect = () => {
        if (attempts > 3) {
          setError('Unable to reconnect. Please rescan QR.');
          return;
        }
        setStatus('reconnecting');
        const newWs = new WebSocket(connection.relay.replace(/^http/, 'ws'));
        newWs.onopen = () => {
          newWs.send(JSON.stringify({ type: 'register-client', token: connection.token }));
        };
        newWs.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.type === 'client-registered') {
            setConnection({ ...connection, ws: newWs, status: 'connected', error: null });
            setStatus('connected');
            setError(null);
            wsRef.current = newWs;
            newWs.addEventListener('message', onMessage);
            newWs.addEventListener('close', onClose);
          } else if (msg.type === 'error') {
            setError(msg.error || 'Connection error.');
            newWs.close();
          }
        };
        newWs.onerror = () => {
          attempts++;
          setTimeout(tryReconnect, 1000 * attempts);
        };
        newWs.onclose = () => {
          attempts++;
          setTimeout(tryReconnect, 1000 * attempts);
        };
      };
      tryReconnect();
    };
    ws.addEventListener('message', onMessage);
    ws.addEventListener('close', onClose);
    return () => {
      ws.removeEventListener('message', onMessage);
      ws.removeEventListener('close', onClose);
    };
  }, [connection, setConnection]);

  const handleSend = () => {
    if ((!input.trim() && !mediaPreview) || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    setSending(true);
    if (mediaPreview) {
      wsRef.current.send(JSON.stringify({ type: 'media', media: mediaPreview }));
      setMessages((prev) => [...prev, { sender: 'user', ts: Date.now(), media: mediaPreview }]);
      setMediaPreview(null);
    }
    if (input.trim()) {
      wsRef.current.send(JSON.stringify({ type: 'chat', text: input }));
      setMessages((prev) => [...prev, { sender: 'user', text: input, ts: Date.now() }]);
      setInput('');
    }
    setSending(false);
  };

  // Media capture/upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setMediaPreview({ type: file.type, data: reader.result as string, name: file.name });
    };
    reader.readAsDataURL(file);
  };
  const handleCapture = async (type: 'image' | 'video' | 'audio') => {
    try {
      let accept = '';
      let capture = '';
      if (type === 'image') { accept = 'image/*'; capture = 'environment'; }
      if (type === 'video') { accept = 'video/*'; capture = 'environment'; }
      if (type === 'audio') { accept = 'audio/*'; capture = 'microphone'; }
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      (input as any).capture = capture;
      input.onchange = (e: any) => handleFileChange(e as React.ChangeEvent<HTMLInputElement>);
      input.click();
    } catch {
      setError('Media capture not supported on this device.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground safe-bottom">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted sticky top-0 z-10">
        <div className="font-bold text-lg">Atlas Chat</div>
        <div className={
          status === 'connected' ? 'text-green-500' :
          status === 'reconnecting' ? 'text-yellow-500 animate-pulse' :
          'text-red-500'
        } aria-label="Connection Status">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        {messages.length === 0 && <div className="text-center text-muted-foreground">No messages yet. Say hello!</div>}
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div className={
              'rounded-lg px-4 py-2 max-w-xs bubble-in ' +
              (msg.sender === 'user' ? 'bg-primary text-white' : 'bg-muted text-foreground')
            } tabIndex={0} aria-label={msg.text ? msg.text : msg.media?.name || 'Media message'}>
              {msg.text && <div>{msg.text}</div>}
              {msg.media && (
                <div className="mt-1">
                  {msg.media.type.startsWith('image') && <img src={msg.media.data} alt={msg.media.name || 'image'} className="max-w-[180px] max-h-[180px] rounded" />}
                  {msg.media.type.startsWith('video') && <video src={msg.media.data} controls className="max-w-[180px] max-h-[180px] rounded" />}
                  {msg.media.type.startsWith('audio') && <audio src={msg.media.data} controls className="w-full" />}
                  {!/^image|video|audio/.test(msg.media.type) && <span>Unsupported media</span>}
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-1 text-right">{new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        ))}
        {mediaPreview && (
          <div className="flex justify-end">
            <div className="rounded-lg px-4 py-2 max-w-xs bg-primary/20 text-foreground border border-primary bubble-in">
              <div className="mb-1 font-semibold">Preview:</div>
              {mediaPreview.type.startsWith('image') && <img src={mediaPreview.data} alt={mediaPreview.name || 'image'} className="max-w-[180px] max-h-[180px] rounded" />}
              {mediaPreview.type.startsWith('video') && <video src={mediaPreview.data} controls className="max-w-[180px] max-h-[180px] rounded" />}
              {mediaPreview.type.startsWith('audio') && <audio src={mediaPreview.data} controls className="w-full" />}
              {!/^image|video|audio/.test(mediaPreview.type) && <span>Unsupported media</span>}
              <div className="flex gap-2 mt-2">
                <button className="px-2 py-1 rounded bg-primary text-white text-xs focus-visible" aria-label="Send Media" onClick={handleSend} disabled={sending || status !== 'connected'}>Send</button>
                <button className="px-2 py-1 rounded bg-muted text-xs border border-border focus-visible" aria-label="Cancel Media Preview" onClick={() => setMediaPreview(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="px-2 py-2 border-t border-border bg-background sticky bottom-0 z-10 flex items-center gap-2 safe-bottom">
        <button className="rounded-full p-2 bg-muted hover:bg-primary/10 focus-visible" title="Send Image" aria-label="Send Image" onClick={() => handleCapture('image')}>
          <span role="img" aria-label="camera">📷</span>
        </button>
        <button className="rounded-full p-2 bg-muted hover:bg-primary/10 focus-visible" title="Send Video" aria-label="Send Video" onClick={() => handleCapture('video')}>
          <span role="img" aria-label="video">🎥</span>
        </button>
        <button className="rounded-full p-2 bg-muted hover:bg-primary/10 focus-visible" title="Send Audio" aria-label="Send Audio" onClick={() => handleCapture('audio')}>
          <span role="img" aria-label="audio">🎤</span>
        </button>
        <input
          className="flex-1 rounded-lg border border-border px-3 py-2 mr-2 text-base bg-muted focus:outline-none focus-visible"
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          disabled={status !== 'connected' || sending || !!mediaPreview}
          aria-label="Chat message input"
        />
        <button
          className="rounded-lg bg-primary text-white px-4 py-2 font-semibold disabled:opacity-50 focus-visible"
          onClick={handleSend}
          disabled={(!input.trim() && !mediaPreview) || status !== 'connected' || sending}
          aria-label="Send Message"
        >Send</button>
      </div>
      {error && <div className="text-center text-red-500 py-2 text-sm bg-background sticky bottom-14 z-20" role="alert">{error}</div>}
    </div>
  );
};

const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<ConnectionState | null>(null);
  return (
    <ConnectionContext.Provider value={{ connection, setConnection }}>
      {children}
    </ConnectionContext.Provider>
  );
};

const MobileApp = () => (
  <ConnectionProvider>
    <BrowserRouter basename="/mobile">
      <Routes>
        <Route path="/" element={<MobileSplash />} />
        <Route path="/scan" element={<QrScannerScreen />} />
        <Route path="/connecting" element={<ConnectingScreen />} />
        <Route path="/success" element={<ConnectionSuccessScreen />} />
        <Route path="/local" element={<LocalModeScreen />} />
        <Route path="/chat" element={<ChatScreen />} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  </ConnectionProvider>
);

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<MobileApp />);
}

export default MobileApp; 