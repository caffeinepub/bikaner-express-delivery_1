import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export default function EmptyStateCard({ icon: Icon, title, description, className }: EmptyStateCardProps) {
  return (
    <Card className={cn('border shadow-sm', className)}>
      <CardContent className="py-16">
        <div className="text-center">
          <Icon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
          <p className="text-base font-medium text-foreground mb-1">{title}</p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
