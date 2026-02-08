import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { usePWAInstallPrompt } from '../../hooks/usePWAInstallPrompt';

export default function InstallAppButton() {
  const { isInstallable, isInstalling, install } = usePWAInstallPrompt();

  if (!isInstallable) return null;

  return (
    <Button onClick={install} disabled={isInstalling} variant="outline" className="w-full">
      {isInstalling ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Installing...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Install App
        </>
      )}
    </Button>
  );
}
