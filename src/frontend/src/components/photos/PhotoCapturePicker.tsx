import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCamera } from '../../camera/useCamera';

interface PhotoCapturePickerProps {
  onPhotoSelected: (file: File) => void;
  disabled?: boolean;
  label?: string;
}

export default function PhotoCapturePicker({ onPhotoSelected, disabled, label = 'Add Photo' }: PhotoCapturePickerProps) {
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode: 'environment' });

  const handleOpenCamera = async () => {
    setShowCamera(true);
    const success = await startCamera();
    if (!success) {
      setShowCamera(false);
    }
  };

  const handleCloseCamera = async () => {
    await stopCamera();
    setShowCamera(false);
  };

  const handleCapture = async () => {
    const photo = await capturePhoto();
    if (photo) {
      onPhotoSelected(photo);
      await handleCloseCamera();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoSelected(file);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        {isSupported && (
          <Button
            type="button"
            variant="outline"
            onClick={handleOpenCamera}
            disabled={disabled}
            className="flex-1"
          >
            <Camera className="mr-2 h-4 w-4" />
            Camera
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex-1"
        >
          <Upload className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Dialog open={showCamera} onOpenChange={(open) => !open && handleCloseCamera()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Take Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error.message}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleCapture}
                disabled={!isActive || isLoading}
                className="flex-1"
              >
                <Camera className="mr-2 h-4 w-4" />
                Capture
              </Button>
              <Button
                onClick={handleCloseCamera}
                variant="outline"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
