import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useCreateAdminOrder } from '../../../hooks/useAdminOrders';
import { toast } from 'sonner';
import type { Variant_cash_online } from '../../../backend';

interface AdminCreateOrderPageProps {
  onBack: () => void;
}

export default function AdminCreateOrderPage({ onBack }: AdminCreateOrderPageProps) {
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [parcelDescription, setParcelDescription] = useState('');
  const [paymentType, setPaymentType] = useState<'cash' | 'online'>('cash');

  const createOrder = useCreateAdminOrder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !mobileNumber.trim() || !pickupLocation.trim() || !dropLocation.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createOrder.mutateAsync({
        customerName: customerName.trim(),
        mobileNumber: mobileNumber.trim(),
        pickupLocation: pickupLocation.trim(),
        pickupAddress: pickupAddress.trim() || pickupLocation.trim(),
        dropLocation: dropLocation.trim(),
        deliveryAddress: deliveryAddress.trim() || dropLocation.trim(),
        parcelDescription: parcelDescription.trim() || 'No description',
        paymentType: paymentType as Variant_cash_online,
      });
      toast.success('Order created successfully!');
      onBack();
    } catch (error) {
      console.error('Create order error:', error);
      toast.error('Failed to create order. Please try again.');
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
          <CardTitle>Create New Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number *</Label>
                <Input
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter mobile number"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupLocation">Pickup Location *</Label>
              <Input
                id="pickupLocation"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Enter pickup location"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Pickup Address (Optional)</Label>
              <Textarea
                id="pickupAddress"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Enter detailed pickup address"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dropLocation">Drop Location *</Label>
              <Input
                id="dropLocation"
                value={dropLocation}
                onChange={(e) => setDropLocation(e.target.value)}
                placeholder="Enter drop location"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Delivery Address (Optional)</Label>
              <Textarea
                id="deliveryAddress"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter detailed delivery address"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parcelDescription">Parcel Description</Label>
              <Textarea
                id="parcelDescription"
                value={parcelDescription}
                onChange={(e) => setParcelDescription(e.target.value)}
                placeholder="Enter parcel description"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentType">Payment Type *</Label>
              <Select value={paymentType} onValueChange={(value: 'cash' | 'online') => setPaymentType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash on Delivery</SelectItem>
                  <SelectItem value="online">Online Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={createOrder.isPending}>
              {createOrder.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Order...
                </>
              ) : (
                'Create Order'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
