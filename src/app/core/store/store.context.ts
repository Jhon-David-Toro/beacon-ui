import { createContext } from '@lit/context'
import type { IncidentStore } from './IncidentStore'

export const incidentStoreContext = createContext<IncidentStore>(Symbol('incident-store'))
