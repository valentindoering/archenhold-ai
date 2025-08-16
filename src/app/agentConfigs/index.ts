import { simpleHandoffScenario } from './simpleHandoff';
import { customerServiceRetailScenario } from './customerServiceRetail';
import { chatSupervisorScenario } from './chatSupervisor';
import { chatSupervisor2Scenario } from './chatSupervisor2';
import { chatSupervisor3Scenario } from './chatSupervisor3';

import type { RealtimeAgent } from '@openai/agents/realtime';

// Map of scenario key -> array of RealtimeAgent objects
export const allAgentSets: Record<string, RealtimeAgent[]> = {
  simpleHandoff: simpleHandoffScenario,
  customerServiceRetail: customerServiceRetailScenario,
  chatSupervisor: chatSupervisorScenario,
  chatSupervisor2: chatSupervisor2Scenario,
  chatSupervisor3: chatSupervisor3Scenario,
};

export const defaultAgentSetKey = 'chatSupervisor';
