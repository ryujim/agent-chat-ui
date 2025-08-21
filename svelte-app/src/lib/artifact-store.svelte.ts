import type { ComponentType } from 'svelte';

export function createArtifactStore() {
  const state = $state({
    isOpen: false,
    component: null as ComponentType | null,
    props: {} as Record<string, unknown>,
    title: '' as string,
    context: {} as Record<string, unknown>,
  });

  const open = (component: ComponentType, props: Record<string, unknown>, title: string) => {
    state.isOpen = true;
    state.component = component;
    state.props = props;
    state.title = title;
  };

  const close = () => {
    state.isOpen = false;
    state.component = null;
    state.props = {};
    state.title = '';
  };

  const setContext = (context: Record<string, unknown>) => {
    state.context = context;
  };

  return {
    state,
    open,
    close,
    setContext,
  };
}
