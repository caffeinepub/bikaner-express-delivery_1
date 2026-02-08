import RiderBottomNav from './components/RiderBottomNav';
import AppSurface from '../../components/layout/AppSurface';
import RiderOrdersPage from './pages/RiderOrdersPage';
import RiderProfilePage from './pages/RiderProfilePage';
import { useState } from 'react';

export default function RiderShell() {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  return (
    <AppSurface>
      <div className="pb-24">
        {activeTab === 'orders' && <RiderOrdersPage />}
        {activeTab === 'profile' && <RiderProfilePage />}
      </div>
      <RiderBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </AppSurface>
  );
}
