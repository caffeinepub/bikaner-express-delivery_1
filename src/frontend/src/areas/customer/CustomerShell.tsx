import { Outlet } from '@tanstack/react-router';
import CustomerBottomNav from './components/CustomerBottomNav';
import AppSurface from '../../components/layout/AppSurface';
import CustomerBookDeliveryPage from './pages/CustomerBookDeliveryPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import { useState } from 'react';

export default function CustomerShell() {
  const [activeTab, setActiveTab] = useState<'book' | 'orders' | 'profile'>('book');

  return (
    <AppSurface>
      <div className="pb-20">
        {activeTab === 'book' && <CustomerBookDeliveryPage />}
        {activeTab === 'orders' && <CustomerOrdersPage />}
        {activeTab === 'profile' && <CustomerProfilePage />}
      </div>
      <CustomerBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </AppSurface>
  );
}
