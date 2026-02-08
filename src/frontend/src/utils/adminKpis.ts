import type { DeliveryOrderInternal, RiderProfile } from '../backend';

export function getTodayOrders(orders: DeliveryOrderInternal[]): DeliveryOrderInternal[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = BigInt(today.getTime() * 1000000);

  return orders.filter((order) => order.timestamp >= todayTimestamp);
}

export function getThisMonthOrders(orders: DeliveryOrderInternal[]): DeliveryOrderInternal[] {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  firstDayOfMonth.setHours(0, 0, 0, 0);
  const monthStartTimestamp = BigInt(firstDayOfMonth.getTime() * 1000000);

  return orders.filter((order) => order.timestamp >= monthStartTimestamp);
}

export function getPendingOrders(orders: DeliveryOrderInternal[]): DeliveryOrderInternal[] {
  return orders.filter((order) => 
    order.status === 'new' || order.status === 'assigned' || order.status === 'picked'
  );
}

export function getCompletedOrders(orders: DeliveryOrderInternal[]): DeliveryOrderInternal[] {
  return orders.filter((order) => order.status === 'delivered');
}

export function getActiveRiders(orders: DeliveryOrderInternal[], riders: RiderProfile[]): RiderProfile[] {
  const activeRiderIds = new Set(
    orders
      .filter((order) => order.status === 'assigned' || order.status === 'picked')
      .map((order) => order.assignedRider?.toString())
      .filter(Boolean)
  );

  return riders.filter((rider) => activeRiderIds.has(rider.id.toString()));
}

export function calculateEarnings(orders: DeliveryOrderInternal[]): { daily: number; monthly: number } {
  const BASE_RATE = 50; // Base delivery charge in rupees
  
  const todayOrders = getTodayOrders(orders);
  const monthOrders = getThisMonthOrders(orders);

  const daily = todayOrders.filter((o) => o.status === 'delivered').length * BASE_RATE;
  const monthly = monthOrders.filter((o) => o.status === 'delivered').length * BASE_RATE;

  return { daily, monthly };
}
