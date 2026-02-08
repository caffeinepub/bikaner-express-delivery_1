import { Package, List, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomerBottomNavProps {
  activeTab: 'book' | 'orders' | 'profile';
  onTabChange: (tab: 'book' | 'orders' | 'profile') => void;
}

export default function CustomerBottomNav({ activeTab, onTabChange }: CustomerBottomNavProps) {
  const tabs = [
    { id: 'book' as const, label: 'Book', icon: Package },
    { id: 'orders' as const, label: 'Orders', icon: List },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className={cn('h-6 w-6 mb-1', isActive && 'animate-bounce-subtle')} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
