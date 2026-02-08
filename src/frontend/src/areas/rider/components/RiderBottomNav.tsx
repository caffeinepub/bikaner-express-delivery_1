import { List, User } from 'lucide-react';
import MobileBottomNav from '../../../components/layout/MobileBottomNav';

interface RiderBottomNavProps {
  activeTab: 'orders' | 'profile';
  onTabChange: (tab: 'orders' | 'profile') => void;
}

export default function RiderBottomNav({ activeTab, onTabChange }: RiderBottomNavProps) {
  const tabs = [
    { id: 'orders', label: 'Orders', icon: List },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <MobileBottomNav 
      tabs={tabs} 
      activeTab={activeTab} 
      onTabChange={(tabId) => onTabChange(tabId as 'orders' | 'profile')} 
    />
  );
}
