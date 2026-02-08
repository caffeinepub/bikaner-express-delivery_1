import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Package, Image as ImageIcon } from 'lucide-react';
import WhatsAppOrderAction from '../../../components/actions/WhatsAppOrderAction';
import { bytesToImageUrl } from '../../../utils/fileToBytes';
import type { DeliveryOrderInternal } from '../../../backend';
import { useEffect, useState } from 'react';

interface CustomerOrderDetailPageProps {
  order: DeliveryOrderInternal;
  onBack: () => void;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
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
    case 'pending':
      return 'Pending';
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

export default function CustomerOrderDetailPage({ order, onBack }: CustomerOrderDetailPageProps) {
  const [parcelPhotoUrl, setParcelPhotoUrl] = useState<string | null>(null);
  const [proofPhotoUrl, setProofPhotoUrl] = useState<string | null>(null);

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
      setProofPhotoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [order.proofPhoto]);

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
              <p className="text-sm">{order.pickupAddress}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Delivery</p>
              <p className="text-sm">{order.deliveryAddress}</p>
            </div>
          </CardContent>
        </Card>

        {(parcelPhotoUrl || proofPhotoUrl) && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Photos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {parcelPhotoUrl && (
                <div>
                  <p className="text-sm font-medium mb-2">Parcel Photo</p>
                  <img
                    src={parcelPhotoUrl}
                    alt="Parcel"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              {proofPhotoUrl && (
                <div>
                  <p className="text-sm font-medium mb-2">Delivery Proof</p>
                  <img
                    src={proofPhotoUrl}
                    alt="Delivery proof"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Contact support about this order</CardDescription>
          </CardHeader>
          <CardContent>
            <WhatsAppOrderAction orderId={order.id} pickupAddress={order.pickupAddress} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
