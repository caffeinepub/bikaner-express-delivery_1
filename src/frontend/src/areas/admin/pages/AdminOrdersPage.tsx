import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, MapPin, Loader2 } from 'lucide-react';
import { useGetAllOrders } from '../../../hooks/useAdminOrders';
import AdminOrderDetailPage from './AdminOrderDetailPage';
import type { DeliveryOrderInternal, OrderStatus } from '../../../backend';

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

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useGetAllOrders();
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrderInternal | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (selectedOrder) {
    return <AdminOrderDetailPage order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  const filteredOrders = orders?.filter((order) => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Filter Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="pickedUp">Picked Up</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Loading orders...</p>
            </div>
          </CardContent>
        </Card>
      ) : !filteredOrders || filteredOrders.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No orders found</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <Card
              key={order.id}
              className="border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setSelectedOrder(order)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {order.pickupAddress.substring(0, 40)}
                      {order.pickupAddress.length > 40 ? '...' : ''}
                    </CardDescription>
                    {order.assignedRider && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Rider: {order.assignedRider.toString().substring(0, 10)}...
                      </p>
                    )}
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
