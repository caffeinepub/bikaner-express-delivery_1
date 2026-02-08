import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MapPin, Package, User, Loader2, Image as ImageIcon } from 'lucide-react';
import { useAssignRider } from '../../../hooks/useAdminOrders';
import { bytesToImageUrl } from '../../../utils/fileToBytes';
import { toast } from 'sonner';
import type { DeliveryOrderInternal } from '../../../backend';

interface AdminOrderDetailPageProps {
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

export default function AdminOrderDetailPage({ order, onBack }: AdminOrderDetailPageProps) {
  const [riderPrincipal, setRiderPrincipal] = useState('');
  const [parcelPhotoUrl, setParcelPhotoUrl] = useState<string | null>(null);
  const [proofPhotoUrl, setProofPhotoUrl] = useState<string | null>(null);

  const assignRider = useAssignRider();

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

  const handleAssignRider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!riderPrincipal.trim()) return;

    try {
      await assignRider.mutateAsync({ orderId: order.id, riderId: riderPrincipal.trim() });
      toast.success('Rider assigned successfully!');
      setRiderPrincipal('');
    } catch (error) {
      console.error('Assign rider error:', error);
      toast.error('Failed to assign rider. Please check the principal ID.');
    }
  };

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="text-white hover:text-white/80">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order #{order.id}</CardTitle>
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

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-mono">{order.customer.toString()}</p>
        </CardContent>
      </Card>

      {order.status === 'pending' && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Assign Rider</CardTitle>
            <CardDescription>Enter rider's principal ID</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAssignRider} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="rider">Rider Principal ID</Label>
                <Input
                  id="rider"
                  type="text"
                  placeholder="Enter principal ID"
                  value={riderPrincipal}
                  onChange={(e) => setRiderPrincipal(e.target.value)}
                  disabled={assignRider.isPending}
                />
              </div>
              <Button type="submit" disabled={assignRider.isPending || !riderPrincipal.trim()} className="w-full">
                {assignRider.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  'Assign Rider'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {order.assignedRider && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Assigned Rider</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-mono">{order.assignedRider.toString()}</p>
          </CardContent>
        </Card>
      )}

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
                <img src={parcelPhotoUrl} alt="Parcel" className="w-full rounded-lg" />
              </div>
            )}
            {proofPhotoUrl && (
              <div>
                <p className="text-sm font-medium mb-2">Delivery Proof</p>
                <img src={proofPhotoUrl} alt="Delivery proof" className="w-full rounded-lg" />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
