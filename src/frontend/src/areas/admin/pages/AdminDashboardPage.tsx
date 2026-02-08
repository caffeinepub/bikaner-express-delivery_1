import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Clock, Bike, CheckCircle2, DollarSign, TrendingUp } from 'lucide-react';
import { useGetAllOrders } from '../../../hooks/useAdminOrders';
import { useGetAllRiders } from '../../../hooks/useAdminRiders';
import { getTodayOrders, getThisMonthOrders, getPendingOrders, getCompletedOrders, getActiveRiders, calculateEarnings } from '../../../utils/adminKpis';

export default function AdminDashboardPage() {
  const { data: orders } = useGetAllOrders();
  const { data: riders } = useGetAllRiders();

  const todayOrders = getTodayOrders(orders || []);
  const monthOrders = getThisMonthOrders(orders || []);
  const pendingCount = getPendingOrders(orders || []).length;
  const completedCount = getCompletedOrders(orders || []).length;
  const activeRidersCount = getActiveRiders(orders || [], riders || []).length;
  const { daily, monthly } = calculateEarnings(orders || []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{todayOrders.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{monthOrders.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">{pendingCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{completedCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Riders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Bike className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{activeRidersCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">₹{daily}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Monthly Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-3xl font-bold">₹{monthly}</p>
              <p className="text-sm text-muted-foreground">Total earnings this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
