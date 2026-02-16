import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AffiliateLinksPlaceholder() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-destructive/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive font-creepster text-lg">
          <ShoppingBag className="h-5 w-5" />
          Recommended Horror Books
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
          <div className="flex-1">
            <p className="text-sm font-medium">Horror Book Title</p>
            <p className="text-xs text-muted-foreground">Affiliate Link</p>
          </div>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
          <div className="flex-1">
            <p className="text-sm font-medium">Horror Book Title</p>
            <p className="text-xs text-muted-foreground">Affiliate Link</p>
          </div>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center pt-2">
          Amazon Affiliate Links
        </p>
      </CardContent>
    </Card>
  );
}
