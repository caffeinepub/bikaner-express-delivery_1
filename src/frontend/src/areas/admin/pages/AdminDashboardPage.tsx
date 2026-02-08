import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Clock, Bike, CheckCircle2 } from 'lucide-react';
import { useGetAllOrders } from '../../../hooks/useAdminOrders';

export default function AdminDashboardPage() {
  const { data: orders } = useGetAllOrders();

  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter((o) => o.status === 'pending').length || 0,
    assigned: orders?.filter((o) => o.status === 'assigned').length || 0,
    pickedUp: orders?.filter((o) => o.status === 'pickedUp').length || 0,
    delivered: orders?.filter((o) => o.status === 'delivered').length || 0,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">{stats.pending}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Bike className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.assigned + stats.pickedUp}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.delivered}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
