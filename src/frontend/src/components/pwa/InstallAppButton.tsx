import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { usePWAInstallPrompt } from '../../hooks/usePWAInstallPrompt';

export default function InstallAppButton() {
  const { shouldShowInstallButton, isInstalling, install } = usePWAInstallPrompt();

  if (!shouldShowInstallButton) return null;

  return (
    <Button 
      onClick={install} 
      disabled={isInstalling} 
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
    >
      {isInstalling ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Installing...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Install Bikaner Express App
        </>
      )}
    </Button>
  );
}
