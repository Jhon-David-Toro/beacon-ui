import { createContext } from '@lit/context'
import type { IncidentStore } from './IncidentStore'

/** Context key under which `AppRoot` provides the incident store. */
export const incidentStoreContext = createContext<IncidentStore>(Symbol('incident-store'))
