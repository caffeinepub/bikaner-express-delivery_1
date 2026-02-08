import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { List, Package, MapPin, Loader2 } from 'lucide-react';
import { useGetMyOrders } from '../../../hooks/useOrders';
import CustomerOrderDetailPage from './CustomerOrderDetailPage';
import PageContainer from '../../../components/layout/PageContainer';
import EmptyStateCard from '../../../components/patterns/EmptyStateCard';
import type { DeliveryOrderInternal } from '../../../backend';

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

export default function CustomerOrdersPage() {
  const { data: orders, isLoading } = useGetMyOrders();
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrderInternal | null>(null);

  if (selectedOrder) {
    return <CustomerOrderDetailPage order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <PageContainer withBottomNav>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <List className="h-6 w-6" />
            My Orders
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Track your delivery requests</p>
        </div>

        {isLoading ? (
          <Card className="border shadow-sm">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p className="text-sm">Loading orders...</p>
              </div>
            </CardContent>
          </Card>
        ) : !orders || orders.length === 0 ? (
          <EmptyStateCard
            icon={Package}
            title="No orders yet"
            description="Book your first delivery to get started"
          />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedOrder(order)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base">Order #{order.id}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          {order.pickupAddress.substring(0, 40)}
                          {order.pickupAddress.length > 40 ? '...' : ''}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status)} variant="outline">
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
