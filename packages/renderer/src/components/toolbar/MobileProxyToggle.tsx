import React, { useEffect, useState } from 'react';
import { Wifi, QrCode, Smartphone, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { QRCodeSVG } from 'qrcode.react';

interface ProxyStatus {
  active: boolean;
  port: number | null;
  clients: number;
  clientDetails?: any[];
}

interface QRCodeData {
  qrCode: string;
  connectionUrl: string;
}

const MobileProxyToggle: React.FC = () => {
  const [status, setStatus] = useState<ProxyStatus>({ active: false, port: null, clients: 0 });
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const currentStatus = await window.electronAPI.getProxyStatus();
        setStatus(currentStatus);
      } catch (error) {
        console.error('Failed to get proxy status:', error);
      }
    };

    fetchStatus();

    // Set up event listeners
    const statusChangedHandler = (newStatus: ProxyStatus) => {
      setStatus(newStatus);
    };

    const clientConnectedHandler = (data: any) => {
      setStatus(prev => ({
        ...prev,
        clients: data.totalClients
      }));
      // Notify user
      console.info(`Mobile client connected: ${data.client.name}`);
    };

    const clientDisconnectedHandler = (data: any) => {
      setStatus(prev => ({
        ...prev,
        clients: data.totalClients
      }));
      // Notify user
      console.info(`Mobile client disconnected: ${data.client.name}`);
    };

    window.electronAPI.onProxyStatusChanged(statusChangedHandler);
    window.electronAPI.onProxyClientConnected(clientConnectedHandler);
    window.electronAPI.onProxyClientDisconnected(clientDisconnectedHandler);

    // Clean up event listeners
    return () => {
      window.electronAPI.removeProxyStatusListener();
      window.electronAPI.removeProxyClientConnectedListener();
      window.electronAPI.removeProxyClientDisconnectedListener();
    };
  }, []);

  const handleToggleProxy = async () => {
    setLoading(true);
    try {
      if (status.active) {
        await window.electronAPI.stopProxyServer();
        setQrData(null);
      } else {
        const result = await window.electronAPI.startProxyServer();
        if (result.success) {
          generateQRCode();
        }
      }
    } catch (error) {
      console.error('Failed to toggle proxy server:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    try {
      const result = await window.electronAPI.generatePairingQRCode();
      if (result.success) {
        setQrData({
          qrCode: result.qrCode,
          connectionUrl: result.connectionUrl
        });
      }
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const showDetails = () => {
    setIsModalVisible(true);
  };

  const showStatusWindow = async () => {
    try {
      await window.electronAPI.showProxyStatusWindow();
    } catch (error) {
      console.error('Failed to show status window:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <Button
                variant={status.active ? "default" : "outline"}
                size="sm"
                onClick={handleToggleProxy}
                disabled={loading}
                className="gap-1"
              >
                <Wifi className="w-4 h-4" />
                {status.active ? 'Proxy On' : 'Proxy Off'}
              </Button>
              {status.clients > 0 && (
                <Badge className="absolute -top-2 -right-2 px-1 min-w-[18px] h-[18px] text-[10px] flex items-center justify-center">
                  {status.clients}
                </Badge>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {status.active ? 'Mobile proxy is active' : 'Enable mobile proxy'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {status.active && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={showDetails}
                >
                  <QrCode className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Show QR code for pairing
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={showStatusWindow}
                >
                  <Info className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Show proxy status window
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}

      <Dialog open={isModalVisible} onOpenChange={setIsModalVisible}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mobile Connection</DialogTitle>
            <DialogDescription>
              Scan this QR code with your mobile device to connect to this desktop instance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-4">
            {qrData ? (
              <div className="bg-white p-4 rounded-md">
                <QRCodeSVG value={qrData.connectionUrl} size={200} />
              </div>
            ) : (
              <div className="h-[200px] w-[200px] flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" /> Connected clients: {status.clients}
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4" /> Proxy port: {status.port || 'N/A'}
            </div>
          </div>
            
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalVisible(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={generateQRCode}
            >
              Regenerate QR Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobileProxyToggle; 