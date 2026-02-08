import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Package, Navigation, Camera, Loader2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { buildGoogleMapsUrl } from '../../../utils/deepLinks';
import PhotoCapturePicker from '../../../components/photos/PhotoCapturePicker';
import { useUploadProofPhoto } from '../../../hooks/usePhotoUploads';
import { useUpdateOrderStatus } from '../../../hooks/useRiderActions';
import { fileToBytes, bytesToImageUrl } from '../../../utils/fileToBytes';
import { toast } from 'sonner';
import type { DeliveryOrderInternal } from '../../../backend';
import { OrderStatus } from '../../../backend';

interface RiderOrderDetailPageProps {
  order: DeliveryOrderInternal;
  onBack: () => void;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'assigned':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'pickedUp':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case 'delivered':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'assigned':
      return 'Assigned';
    case 'pickedUp':
      return 'Picked Up';
    case 'delivered':
      return 'Delivered';
    default:
      return status;
  }
}

export default function RiderOrderDetailPage({ order, onBack }: RiderOrderDetailPageProps) {
  const [proofPhoto, setProofPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [parcelPhotoUrl, setParcelPhotoUrl] = useState<string | null>(null);
  const [existingProofUrl, setExistingProofUrl] = useState<string | null>(null);

  const uploadProof = useUploadProofPhoto();
  const updateStatus = useUpdateOrderStatus();

  useEffect(() => {
    if (order.parcelPhoto) {
      const url = bytesToImageUrl(order.parcelPhoto);
      setParcelPhotoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [order.parcelPhoto]);

  useEffect(() => {
    if (order.proofPhoto) {
      const url = bytesToImageUrl(order.proofPhoto);
      setExistingProofUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [order.proofPhoto]);

  const handleNavigate = () => {
    const mapsUrl = buildGoogleMapsUrl(order.pickupAddress);
    window.open(mapsUrl, '_blank');
  };

  const handlePhotoSelected = (file: File) => {
    setProofPhoto(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const handleUploadProof = async () => {
    if (!proofPhoto) return;

    try {
      const photoBytes = await fileToBytes(proofPhoto);
      await uploadProof.mutateAsync({ orderId: order.id, photo: photoBytes });
      toast.success('Delivery proof uploaded!');
      setProofPhoto(null);
      setPhotoPreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload proof. Please try again.');
    }
  };

  const handlePickup = async () => {
    try {
      await updateStatus.mutateAsync({ orderId: order.id, status: OrderStatus.pickedUp });
      toast.success('Order marked as picked up!');
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status. Please try again.');
    }
  };

  const handleDeliver = async () => {
    try {
      await updateStatus.mutateAsync({ orderId: order.id, status: OrderStatus.delivered });
      toast.success('Order marked as delivered!');
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status. Please try again.');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="mb-6 pt-4">
        <Button variant="ghost" onClick={onBack} className="mb-2 text-white hover:text-white/80">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Package className="h-8 w-8" />
          Order #{order.id}
        </h1>
      </div>

      <div className="space-y-4">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Status</CardTitle>
              <Badge className={getStatusColor(order.status)}>
                {getStatusLabel(order.status)}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Addresses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pickup</p>
              <p className="text-sm mb-2">{order.pickupAddress}</p>
              <Button onClick={handleNavigate} variant="outline" size="sm" className="w-full">
                <Navigation className="mr-2 h-4 w-4" />
                Navigate to Pickup
              </Button>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Delivery</p>
              <p className="text-sm">{order.deliveryAddress}</p>
            </div>
          </CardContent>
        </Card>

        {parcelPhotoUrl && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Parcel Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img src={parcelPhotoUrl} alt="Parcel" className="w-full rounded-lg" />
            </CardContent>
          </Card>
        )}

        {order.status === 'assigned' && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Pick Up Parcel</CardTitle>
              <CardDescription>Mark when you've collected the parcel</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handlePickup} disabled={updateStatus.isPending} className="w-full">
                {updateStatus.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Picked Up
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {order.status === 'pickedUp' && (
          <>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Delivery Proof
                </CardTitle>
                <CardDescription>Upload photo after delivery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {existingProofUrl ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Uploaded proof:</p>
                    <img src={existingProofUrl} alt="Delivery proof" className="w-full rounded-lg" />
                  </div>
                ) : (
                  <>
                    <PhotoCapturePicker
                      onPhotoSelected={handlePhotoSelected}
                      disabled={uploadProof.isPending}
                      label="Upload Proof"
                    />
                    {photoPreview && (
                      <div>
                        <img src={photoPreview} alt="Proof preview" className="w-full rounded-lg mb-2" />
                        <Button
                          onClick={handleUploadProof}
                          disabled={uploadProof.isPending}
                          className="w-full"
                        >
                          {uploadProof.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            'Upload Proof'
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Complete Delivery</CardTitle>
                <CardDescription>Mark order as delivered</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleDeliver}
                  disabled={updateStatus.isPending || !order.proofPhoto}
                  className="w-full"
                >
                  {updateStatus.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark as Delivered
                    </>
                  )}
                </Button>
                {!order.proofPhoto && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Upload delivery proof first
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {order.status === 'delivered' && existingProofUrl && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Delivery Proof
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img src={existingProofUrl} alt="Delivery proof" className="w-full rounded-lg" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
