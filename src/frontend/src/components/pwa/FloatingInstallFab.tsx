import { usePWAInstallPrompt } from '../../hooks/usePWAInstallPrompt';
import { Download, Loader2 } from 'lucide-react';

export default function FloatingInstallFab() {
  const { shouldShowInstallButton, isInstalling, install } = usePWAInstallPrompt();

  if (!shouldShowInstallButton) return null;

  return (
    <button
      onClick={install}
      disabled={isInstalling}
      className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-fab-appear hover:scale-105 active:scale-95"
      aria-label="Install Bikaner Express App"
    >
      {isInstalling ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-medium text-sm">Installing...</span>
        </>
      ) : (
        <>
          <Download className="h-5 w-5" />
          <span className="font-medium text-sm">Install App</span>
        </>
      )}
    </button>
  );
}
