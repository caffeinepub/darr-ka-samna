import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNightMode } from '../hooks/useNightMode';

export function NightModeToggle() {
  const { nightMode, toggleNightMode } = useNightMode();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleNightMode}
      className="border-destructive/30 hover:bg-destructive/10"
    >
      {nightMode ? (
        <>
          <Sun className="h-4 w-4 mr-2" />
          Light Mode
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 mr-2" />
          Night Mode
        </>
      )}
    </Button>
  );
}
