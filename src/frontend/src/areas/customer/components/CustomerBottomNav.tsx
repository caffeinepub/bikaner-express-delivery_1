import { Package, List, User } from 'lucide-react';
import MobileBottomNav from '../../../components/layout/MobileBottomNav';

interface CustomerBottomNavProps {
  activeTab: 'book' | 'orders' | 'profile';
  onTabChange: (tab: 'book' | 'orders' | 'profile') => void;
}

export default function CustomerBottomNav({ activeTab, onTabChange }: CustomerBottomNavProps) {
  const tabs = [
    { id: 'book', label: 'Book', icon: Package },
    { id: 'orders', label: 'Orders', icon: List },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <MobileBottomNav 
      tabs={tabs} 
      activeTab={activeTab} 
      onTabChange={(tabId) => onTabChange(tabId as 'book' | 'orders' | 'profile')} 
    />
  );
}
