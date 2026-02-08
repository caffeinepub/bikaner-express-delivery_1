import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { List, Package, MapPin, Loader2 } from 'lucide-react';
import { useGetMyOrders } from '../../../hooks/useOrders';
import RiderOrderDetailPage from './RiderOrderDetailPage';
import type { DeliveryOrderInternal } from '../../../backend';

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

export default function RiderOrdersPage() {
  const { data: orders, isLoading } = useGetMyOrders();
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrderInternal | null>(null);

  if (selectedOrder) {
    return <RiderOrderDetailPage order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="mb-6 pt-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <List className="h-8 w-8" />
          My Deliveries
        </h1>
        <p className="text-white/80 mt-1">Orders assigned to you</p>
      </div>

      {isLoading ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Loading orders...</p>
            </div>
          </CardContent>
        </Card>
      ) : !orders || orders.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No assigned orders</p>
              <p className="text-sm mt-1">Check back later for new deliveries</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setSelectedOrder(order)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {order.pickupAddress.substring(0, 40)}
                      {order.pickupAddress.length > 40 ? '...' : ''}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
