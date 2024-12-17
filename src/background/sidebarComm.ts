// src/background/sidebarComm.ts
import { EventList, Resorts, Resort } from '../common/types'
import { logger } from '../common/log'

export function updateSidebar(
  event: EventList,
  resorts?: Resorts,
  resort?: Resort
) {
  switch (event) {
    case EventList.loggedIn:
      browser.runtime.sendMessage({
        event,
        status: 'User logged in, get resorts...',
      })
      break
    case EventList.logout:
      browser.runtime.sendMessage({
        event,
        status: 'User logged out',
      })
      break
    case EventList.updateAvailability:
      browser.runtime.sendMessage({
        event,
        status: 'Updated availability...',
        resort,
      })
      break
    case EventList.updateResortData:
      browser.runtime.sendMessage({
        event,
        status: 'Check resort availability...',
        resorts,
      })
      break
    default:
      break
  }
  logger.info('Event sent to sidebar', { event })
}
