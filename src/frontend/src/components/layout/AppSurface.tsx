import { cn } from '@/lib/utils';

interface AppSurfaceProps {
  children: React.ReactNode;
  className?: string;
}

export default function AppSurface({ children, className }: AppSurfaceProps) {
  return (
    <div className={cn('min-h-screen app-gradient pb-20', className)}>
      {children}
    </div>
  );
}
