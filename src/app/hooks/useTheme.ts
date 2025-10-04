import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated to prevent hydration mismatch
    setIsHydrated(true);
    
    // Check if window and matchMedia are available (for SSR compatibility)
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Set initial theme based on system preference
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    // Create event handler for theme changes
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    // Add event listener for theme changes
    mediaQuery.addEventListener('change', handleThemeChange);

    // Cleanup function to remove event listener
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  // Return 'light' during SSR and before hydration to prevent mismatch
  return isHydrated ? theme : 'light';
};
