import type { DeliveryOrderInternal } from '../backend';

export interface ReportData {
  totalOrders: number;
  deliveredCount: number;
  cashOrders: number;
  onlineOrders: number;
  totalEarnings: number;
  newOrders: number;
  assignedOrders: number;
  pickedOrders: number;
}

export function generateReportData(
  orders: DeliveryOrderInternal[],
  period: 'daily' | 'weekly' | 'monthly'
): ReportData {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'daily':
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'weekly':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'monthly':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      break;
  }

  const startTimestamp = BigInt(startDate.getTime() * 1000000);
  const filteredOrders = orders.filter((order) => order.timestamp >= startTimestamp);

  const BASE_RATE = 50;

  return {
    totalOrders: filteredOrders.length,
    deliveredCount: filteredOrders.filter((o) => o.status === 'delivered').length,
    cashOrders: filteredOrders.filter((o) => o.paymentType === 'cash').length,
    onlineOrders: filteredOrders.filter((o) => o.paymentType === 'online').length,
    totalEarnings: filteredOrders.filter((o) => o.status === 'delivered').length * BASE_RATE,
    newOrders: filteredOrders.filter((o) => o.status === 'new').length,
    assignedOrders: filteredOrders.filter((o) => o.status === 'assigned').length,
    pickedOrders: filteredOrders.filter((o) => o.status === 'picked').length,
  };
}

export function exportToCSV(data: ReportData, period: string): void {
  const csvContent = [
    ['Metric', 'Value'],
    ['Report Period', period.charAt(0).toUpperCase() + period.slice(1)],
    ['Total Orders', data.totalOrders.toString()],
    ['Delivered Orders', data.deliveredCount.toString()],
    ['Cash Orders', data.cashOrders.toString()],
    ['Online Orders', data.onlineOrders.toString()],
    ['Total Earnings (₹)', data.totalEarnings.toString()],
    ['New Orders', data.newOrders.toString()],
    ['Assigned Orders', data.assignedOrders.toString()],
    ['Picked Orders', data.pickedOrders.toString()],
  ]
    .map((row) => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `bikaner-express-report-${period}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
