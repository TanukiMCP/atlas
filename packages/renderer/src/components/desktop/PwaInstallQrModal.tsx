import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { QRCodeSVG } from 'qrcode.react';

interface PwaInstallQrModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
}

const PwaInstallQrModal: React.FC<PwaInstallQrModalProps> = ({ open, onClose, url }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Install TanukiMCP Atlas Mobile</DialogTitle>
        <DialogDescription>
          Scan this QR code with your mobile device to install the PWA version of TanukiMCP Atlas.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center justify-center py-4">
        <QRCodeSVG value={url} size={200} />
      </div>
      <DialogFooter className="sm:justify-end">
        <Button type="button" variant="outline" onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default PwaInstallQrModal; 