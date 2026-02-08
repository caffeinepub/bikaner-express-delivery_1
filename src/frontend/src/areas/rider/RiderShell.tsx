import { useState } from 'react';
import AppSurface from '../../components/layout/AppSurface';
import RiderBottomNav from './components/RiderBottomNav';
import RiderOrdersPage from './pages/RiderOrdersPage';
import RiderProfilePage from './pages/RiderProfilePage';

export default function RiderShell() {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  return (
    <AppSurface>
      {activeTab === 'orders' && <RiderOrdersPage />}
      {activeTab === 'profile' && <RiderProfilePage />}
      <RiderBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </AppSurface>
  );
}
