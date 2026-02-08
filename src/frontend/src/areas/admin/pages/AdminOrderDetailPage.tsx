import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MapPin, Package, User, Loader2, Image as ImageIcon, Phone, MessageCircle, ExternalLink } from 'lucide-react';
import { useAssignRiderToOrder, useUpdateOrderStatus } from '../../../hooks/useAdminOrders';
import { useGetAllRiders } from '../../../hooks/useAdminRiders';
import { bytesToImageUrl } from '../../../utils/fileToBytes';
import { buildWhatsAppMessageForRider, buildWhatsAppMessageForCustomer, buildWhatsAppUrl } from '../../../utils/deepLinks';
import { toast } from 'sonner';
import type { DeliveryOrderInternal, OrderStatus } from '../../../backend';
import WhatsAppMessageDialog from '../../../components/actions/WhatsAppMessageDialog';

interface AdminOrderDetailPageProps {
  order: DeliveryOrderInternal;
  onBack: () => void;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'new':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'assigned':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'picked':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case 'delivered':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'new':
      return 'New';
    case 'assigned':
      return 'Assigned';
    case 'picked':
      return 'Picked';
    case 'delivered':
      return 'Delivered';
    default:
      return status;
  }
}

export default function AdminOrderDetailPage({ order, onBack }: AdminOrderDetailPageProps) {
  const [selectedRiderId, setSelectedRiderId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
  const [parcelPhotoUrl, setParcelPhotoUrl] = useState<string | null>(null);
  const [proofPhotoUrl, setProofPhotoUrl] = useState<string | null>(null);
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false);
  const [whatsAppMessage, setWhatsAppMessage] = useState('');

  const { data: riders } = useGetAllRiders();
  const assignRider = useAssignRiderToOrder();
  const updateStatus = useUpdateOrderStatus();

  const assignedRider = riders?.find(r => r.id.toString() === order.assignedRider?.toString());

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

  const handleAssignRider = async () => {
    if (!selectedRiderId) {
      toast.error('Please select a rider');
      return;
    }

    try {
      await assignRider.mutateAsync({ orderId: order.id, riderId: selectedRiderId });
      toast.success('Rider assigned successfully!');
      setSelectedRiderId('');
    } catch (error) {
      console.error('Assign rider error:', error);
      toast.error('Failed to assign rider');
    }
  };

  const handleUpdateStatus = async () => {
    if (selectedStatus === order.status) {
      toast.error('Status is already set to this value');
      return;
    }

    try {
      await updateStatus.mutateAsync({ orderId: order.id, status: selectedStatus });
      toast.success('Order status updated successfully!');
    } catch (error) {
      console.error('Update status error:', error);
      toast.error('Failed to update status');
    }
  };

  const handleMessageRider = () => {
    if (!assignedRider) return;
    const message = buildWhatsAppMessageForRider(order.id, order.pickupLocation, order.dropLocation);
    const url = buildWhatsAppUrl(message, assignedRider.phoneNumber);
    window.open(url, '_blank');
    setTimeout(() => {
      setWhatsAppMessage(message);
      setShowWhatsAppDialog(true);
    }, 2000);
  };

  const handleMessageCustomer = () => {
    const message = buildWhatsAppMessageForCustomer(order.id, order.pickupLocation, order.dropLocation);
    const url = buildWhatsAppUrl(message, order.mobileNumber);
    window.open(url, '_blank');
    setTimeout(() => {
      setWhatsAppMessage(message);
      setShowWhatsAppDialog(true);
    }, 2000);
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
            <User className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-muted-foreground">Name</Label>
            <p className="font-medium">{order.customerName}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Mobile Number</Label>
            <p className="font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {order.mobileNumber}
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">Payment Type</Label>
            <p className="font-medium">{order.paymentType === 'cash' ? 'Cash on Delivery' : 'Online Payment'}</p>
          </div>
          {order.status === 'delivered' && (
            <Button onClick={handleMessageCustomer} variant="outline" className="w-full">
              <MessageCircle className="mr-2 h-4 w-4" />
              Message Customer on WhatsApp
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Delivery Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-muted-foreground">Pickup Location</Label>
            <p className="font-medium">{order.pickupLocation}</p>
            {order.pickupAddress && order.pickupAddress !== order.pickupLocation && (
              <p className="text-sm text-muted-foreground mt-1">{order.pickupAddress}</p>
            )}
          </div>
          <div>
            <Label className="text-muted-foreground">Drop Location</Label>
            <p className="font-medium">{order.dropLocation}</p>
            {order.deliveryAddress && order.deliveryAddress !== order.dropLocation && (
              <p className="text-sm text-muted-foreground mt-1">{order.deliveryAddress}</p>
            )}
          </div>
          <div>
            <Label className="text-muted-foreground">Parcel Description</Label>
            <p className="font-medium">{order.parcelDescription || 'No description'}</p>
          </div>
        </CardContent>
      </Card>

      {assignedRider && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Assigned Rider</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-muted-foreground">Name</Label>
              <p className="font-medium">{assignedRider.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Phone Number</Label>
              <p className="font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {assignedRider.phoneNumber}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Vehicle Type</Label>
              <p className="font-medium">{assignedRider.vehicleType}</p>
            </div>
            {assignedRider.locationUrl ? (
              <Button asChild variant="outline" className="w-full">
                <a href={assignedRider.locationUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in Google Maps
                </a>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-2">No location link provided yet</p>
            )}
            {order.status === 'assigned' && (
              <Button onClick={handleMessageRider} variant="outline" className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                Message Rider on WhatsApp
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {!order.assignedRider && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Assign Rider</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Rider</Label>
              <Select value={selectedRiderId} onValueChange={setSelectedRiderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a rider" />
                </SelectTrigger>
                <SelectContent>
                  {riders?.map((rider) => (
                    <SelectItem key={rider.id.toString()} value={rider.id.toString()}>
                      {rider.name} - {rider.phoneNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAssignRider} className="w-full" disabled={assignRider.isPending || !selectedRiderId}>
              {assignRider.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                'Assign Rider'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Update Order Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as OrderStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="picked">Picked</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleUpdateStatus} className="w-full" disabled={updateStatus.isPending || selectedStatus === order.status}>
            {updateStatus.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Status'
            )}
          </Button>
        </CardContent>
      </Card>

      {parcelPhotoUrl && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Parcel Photo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <img src={parcelPhotoUrl} alt="Parcel" className="w-full rounded-lg" />
          </CardContent>
        </Card>
      )}

      {proofPhotoUrl && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Delivery Proof Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <img src={proofPhotoUrl} alt="Delivery Proof" className="w-full rounded-lg" />
            <p className="text-sm text-muted-foreground">
              Uploaded: {new Date(Number(order.timestamp) / 1000000).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      )}

      <WhatsAppMessageDialog
        open={showWhatsAppDialog}
        onOpenChange={setShowWhatsAppDialog}
        message={whatsAppMessage}
      />
    </div>
  );
}
