import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  withBottomNav?: boolean;
}

export default function PageContainer({ children, className, withBottomNav = false }: PageContainerProps) {
  return (
    <div className={cn(
      'w-full max-w-2xl mx-auto px-4',
      withBottomNav && 'content-with-bottom-nav',
      className
    )}>
      {children}
    </div>
  );
}
