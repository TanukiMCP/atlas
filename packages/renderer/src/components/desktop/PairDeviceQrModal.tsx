import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { QRCodeSVG } from 'qrcode.react';

interface PairDeviceQrModalProps {
  open: boolean;
  onClose: () => void;
  qr: string | null;
  loading: boolean;
  onRegenerate: () => void;
}

const PairDeviceQrModal: React.FC<PairDeviceQrModalProps> = ({ open, onClose, qr, loading, onRegenerate }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Pair Mobile Device</DialogTitle>
        <DialogDescription>
          Scan this QR code with your mobile device to connect securely to this desktop instance.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center justify-center py-4">
        {loading ? (
          <div className="h-[200px] w-[200px] flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : qr ? (
          <div className="bg-white p-4 rounded-md">
            <QRCodeSVG value={qr} size={200} />
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-2">
        <div>• Secure, time-limited connection</div>
        <div>• Works on local network or via relay</div>
        <div>• Only share this QR with trusted devices</div>
      </div>
      <DialogFooter className="sm:justify-between">
        <Button type="button" variant="outline" onClick={onClose}>Close</Button>
        <Button type="button" onClick={onRegenerate} disabled={loading}>Regenerate QR Code</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default PairDeviceQrModal; 