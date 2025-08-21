import { browser } from '$app/environment';

export function getApiKey(): string | null {
  if (browser) {
    return window.localStorage.getItem('lg:chat:apiKey');
  }
  return null;
}

export function setApiKey(key: string): void {
  if (browser) {
    window.localStorage.setItem('lg:chat:apiKey', key);
  }
}
