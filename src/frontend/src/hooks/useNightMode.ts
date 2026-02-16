import { useState, useEffect } from 'react';

const NIGHT_MODE_KEY = 'darr-ka-samna-night-mode';

export function useNightMode() {
  const [nightMode, setNightMode] = useState(() => {
    const stored = localStorage.getItem(NIGHT_MODE_KEY);
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem(NIGHT_MODE_KEY, nightMode.toString());
  }, [nightMode]);

  const toggleNightMode = () => {
    setNightMode((prev) => !prev);
  };

  return {
    nightMode,
    toggleNightMode,
    setNightMode,
  };
}
