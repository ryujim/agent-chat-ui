import { writable } from 'svelte/store';

type ArtifactState = {
  name: string | null;
  props: Record<string, unknown>;
  context: Record<string, unknown>;
  isOpen: boolean;
};

function createArtifactStore() {
  const { subscribe, set, update } = writable<ArtifactState>({
    name: null,
    props: {},
    context: {},
    isOpen: false,
  });

  return {
    subscribe,
    open: (name: string, props: Record<string, unknown> = {}, context: Record<string, unknown> = {}) => {
      set({ name, props, context, isOpen: true });
    },
    close: () => {
      set({ name: null, props: {}, context: {}, isOpen: false });
    },
    setContext: (context: Record<string, unknown>) => {
      update((s) => ({ ...s, context }));
    }
  };
}

export const artifactStore = createArtifactStore();
