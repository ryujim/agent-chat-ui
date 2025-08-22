import AgentInbox from '../routes/artifact/AgentInbox.svelte';
import type { ComponentType } from 'svelte';

export const artifactMap: Record<string, ComponentType> = {
  agent_inbox: AgentInbox,
};
