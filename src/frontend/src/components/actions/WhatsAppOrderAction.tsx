import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MessageCircle, Copy, Check } from 'lucide-react';
import { buildWhatsAppUrl, buildWhatsAppMessage, copyToClipboard } from '../../utils/deepLinks';
import { toast } from 'sonner';

interface WhatsAppOrderActionProps {
  orderId: string;
  pickupAddress: string;
  phoneNumber?: string;
}

export default function WhatsAppOrderAction({ orderId, pickupAddress, phoneNumber }: WhatsAppOrderActionProps) {
  const [showFallback, setShowFallback] = useState(false);
  const [copied, setCopied] = useState(false);

  const message = buildWhatsAppMessage(orderId, pickupAddress);
  const whatsappUrl = buildWhatsAppUrl(message, phoneNumber);

  const handleWhatsAppClick = () => {
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();

    // Show fallback after a delay in case WhatsApp doesn't open
    setTimeout(() => {
      setShowFallback(true);
    }, 2000);
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(message);
      setCopied(true);
      toast.success('Message copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  return (
    <>
      <Button onClick={handleWhatsAppClick} variant="outline" className="w-full">
        <MessageCircle className="mr-2 h-4 w-4" />
        Contact via WhatsApp
      </Button>

      <Dialog open={showFallback} onOpenChange={setShowFallback}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>WhatsApp Message</DialogTitle>
            <DialogDescription>
              If WhatsApp didn't open, you can copy this message and send it manually
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{message}</p>
            </div>
            <Button onClick={handleCopy} variant="outline" className="w-full">
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Message
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
