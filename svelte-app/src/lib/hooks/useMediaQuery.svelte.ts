import { readable } from 'svelte/store';
import { browser } from '$app/environment';

export function useMediaQuery(query: string) {
  if (!browser) {
    return readable(false);
  }

  const mediaQuery = window.matchMedia(query);

  const store = readable(mediaQuery.matches, (set) => {
    const listener = (e: MediaQueryListEvent) => set(e.matches);
    mediaQuery.addEventListener('change', listener);

    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  });

  return store;
}
