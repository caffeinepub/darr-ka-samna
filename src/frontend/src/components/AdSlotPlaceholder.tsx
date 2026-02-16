import { Card, CardContent } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

interface AdSlotPlaceholderProps {
  className?: string;
}

export function AdSlotPlaceholder({ className = '' }: AdSlotPlaceholderProps) {
  return (
    <Card className={`bg-card/30 border-dashed border-2 border-muted ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Megaphone className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-sm font-medium text-muted-foreground">Ad Slot</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Advertisement space</p>
      </CardContent>
    </Card>
  );
}
