import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface NavTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface MobileBottomNavProps {
  tabs: NavTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function MobileBottomNav({ tabs, activeTab, onTabChange }: MobileBottomNavProps) {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50"
      style={{ 
        paddingBottom: 'var(--safe-area-bottom)',
        height: 'calc(var(--bottom-nav-height) + var(--safe-area-bottom))'
      }}
    >
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors gap-1',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
