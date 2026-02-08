import { useState } from 'react';
import AppSurface from '../../components/layout/AppSurface';
import CustomerBottomNav from './components/CustomerBottomNav';
import CustomerBookDeliveryPage from './pages/CustomerBookDeliveryPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import CustomerProfilePage from './pages/CustomerProfilePage';

export default function CustomerShell() {
  const [activeTab, setActiveTab] = useState<'book' | 'orders' | 'profile'>('book');

  return (
    <AppSurface>
      {activeTab === 'book' && <CustomerBookDeliveryPage />}
      {activeTab === 'orders' && <CustomerOrdersPage />}
      {activeTab === 'profile' && <CustomerProfilePage />}
      <CustomerBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </AppSurface>
  );
}
