import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, Package } from 'lucide-react';
import { useCreateOrder } from '../../../hooks/useOrders';
import { useUploadParcelPhoto } from '../../../hooks/usePhotoUploads';
import PhotoCapturePicker from '../../../components/photos/PhotoCapturePicker';
import { fileToBytes, bytesToImageUrl } from '../../../utils/fileToBytes';
import { toast } from 'sonner';

export default function CustomerBookDeliveryPage() {
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [parcelDescription, setParcelDescription] = useState('');
  const [parcelPhoto, setParcelPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState(false);

  const createOrder = useCreateOrder();
  const uploadPhoto = useUploadParcelPhoto();

  const handlePhotoSelected = (file: File) => {
    setParcelPhoto(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupAddress.trim() || !deliveryAddress.trim() || !customerName.trim() || !mobileNumber.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let photoBytes: Uint8Array | undefined;
      if (parcelPhoto) {
        photoBytes = await fileToBytes(parcelPhoto);
      }

      const orderId = await createOrder.mutateAsync({
        pickupAddress: pickupAddress.trim(),
        deliveryAddress: deliveryAddress.trim(),
        customerName: customerName.trim(),
        mobileNumber: mobileNumber.trim(),
        pickupLocation: pickupAddress.trim(),
        dropLocation: deliveryAddress.trim(),
        parcelDescription: parcelDescription.trim() || 'No description',
        paymentType: 'cash',
        parcelPhoto: photoBytes,
      });

      toast.success('Order created successfully!');
      setOrderCreated(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setPickupAddress('');
        setDeliveryAddress('');
        setCustomerName('');
        setMobileNumber('');
        setParcelDescription('');
        setParcelPhoto(null);
        setPhotoPreview(null);
        setOrderCreated(false);
      }, 2000);
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Failed to create order. Please try again.');
    }
  };

  if (orderCreated) {
    return (
      <div className="p-4 max-w-lg mx-auto">
        <Card className="border-0 shadow-lg mt-8">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-green-500/10 rounded-full">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Order Placed!</h3>
                <p className="text-muted-foreground mt-2">
                  Your delivery request has been submitted successfully
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="mb-6 pt-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Package className="h-8 w-8" />
          Book Delivery
        </h1>
        <p className="text-white/80 mt-1">Schedule a new parcel pickup</p>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Delivery Details</CardTitle>
          <CardDescription>Enter pickup and delivery information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Your Name *</Label>
                <Input
                  id="customerName"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  disabled={createOrder.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number *</Label>
                <Input
                  id="mobileNumber"
                  placeholder="Enter mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  disabled={createOrder.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickup">Pickup Address *</Label>
              <Textarea
                id="pickup"
                placeholder="Enter complete pickup address"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                required
                rows={3}
                disabled={createOrder.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery">Delivery Address *</Label>
              <Textarea
                id="delivery"
                placeholder="Enter complete delivery address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
                rows={3}
                disabled={createOrder.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parcelDescription">Parcel Description</Label>
              <Textarea
                id="parcelDescription"
                placeholder="Describe the parcel (optional)"
                value={parcelDescription}
                onChange={(e) => setParcelDescription(e.target.value)}
                rows={2}
                disabled={createOrder.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label>Parcel Photo (Optional)</Label>
              <PhotoCapturePicker
                onPhotoSelected={handlePhotoSelected}
                disabled={createOrder.isPending}
                label="Upload"
              />
              {photoPreview && (
                <div className="mt-2">
                  <img
                    src={photoPreview}
                    alt="Parcel preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12"
              disabled={createOrder.isPending || !pickupAddress.trim() || !deliveryAddress.trim() || !customerName.trim() || !mobileNumber.trim()}
            >
              {createOrder.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Order...
                </>
              ) : (
                'Book Delivery'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
