import { writable } from 'svelte/store';
import type { ComponentType } from 'svelte';

type ArtifactState = {
  component: ComponentType | null;
  props: Record<string, unknown>;
  context: Record<string, unknown>;
  isOpen: boolean;
};

function createArtifactStore() {
  const { subscribe, set, update } = writable<ArtifactState>({
    component: null,
    props: {},
    context: {},
    isOpen: false,
  });

  return {
    subscribe,
    open: (component: ComponentType, props: Record<string, unknown> = {}, context: Record<string, unknown> = {}) => {
      set({ component, props, context, isOpen: true });
    },
    close: () => {
      set({ component: null, props: {}, context: {}, isOpen: false });
    },
    setContext: (context: Record<string, unknown>) => {
      update((s) => ({ ...s, context }));
    }
  };
}

export const artifactStore = createArtifactStore();
