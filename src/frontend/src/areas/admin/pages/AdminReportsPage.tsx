import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, Printer, DollarSign, Package, CheckCircle2 } from 'lucide-react';
import { useGetAllOrders } from '../../../hooks/useAdminOrders';
import { generateReportData, exportToCSV } from '../../../utils/reporting';
import { toast } from 'sonner';

type ReportPeriod = 'daily' | 'weekly' | 'monthly';

export default function AdminReportsPage() {
  const { data: orders } = useGetAllOrders();
  const [period, setPeriod] = useState<ReportPeriod>('daily');

  const reportData = generateReportData(orders || [], period);

  const handleExportCSV = () => {
    try {
      exportToCSV(reportData, period);
      toast.success('Report exported successfully!');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg print:hidden">
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Period</label>
            <Select value={period} onValueChange={(value: ReportPeriod) => setPeriod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportCSV} variant="outline" className="flex-1">
              <FileDown className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex-1">
              <Printer className="mr-2 h-4 w-4" />
              Print PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="print:p-8">
        <div className="text-center mb-6 print:block hidden">
          <h1 className="text-2xl font-bold">Bikaner Express Delivery</h1>
          <p className="text-muted-foreground">
            {period.charAt(0).toUpperCase() + period.slice(1)} Report
          </p>
          <p className="text-sm text-muted-foreground">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{reportData.totalOrders}</span>
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
                <span className="text-2xl font-bold">{reportData.deliveredCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cash Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">{reportData.cashOrders}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Online Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold">{reportData.onlineOrders}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <DollarSign className="h-10 w-10 text-green-600" />
              <div>
                <p className="text-4xl font-bold">₹{reportData.totalEarnings}</p>
                <p className="text-sm text-muted-foreground">
                  {period.charAt(0).toUpperCase() + period.slice(1)} earnings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg mt-4">
          <CardHeader>
            <CardTitle>Order Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">New Orders:</span>
                <span className="font-medium">{reportData.newOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned Orders:</span>
                <span className="font-medium">{reportData.assignedOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Picked Orders:</span>
                <span className="font-medium">{reportData.pickedOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivered Orders:</span>
                <span className="font-medium">{reportData.deliveredCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
