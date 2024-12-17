// src/sidebar/sidebar.ts
import { EventList, Resort } from '../common/types'
import { addEventListeners } from './addEventHandlers'
import {
  hideAvailabilityFormSection as hideCheckAvailabilitySection,
  hideGetResortsButton,
  hideResortSection as hideResortListSection,
  setStatus,
  showavailabilityFormSection as showCheckAailabilitySection,
  showGetResortsButton,
  showResortSection as showResortListSection,
} from './domHandlers'
import {
  deleteResortList,
  listResorts,
  updateResortAvailability,
} from './resortOperations'
import { formatDate } from './utils'
import { logger } from '../common/log'

window.onload = () => {
  const selectedResorts: Resort[] = [] // Array to hold the selected resorts

  // Default start date to tomorrow
  const startDateInput = document.querySelector(
    '#startDate'
  ) as HTMLInputElement
  const tomorrow = new Date()
  tomorrow.setDate(new Date().getDate() + 1)
  startDateInput.value = formatDate(tomorrow)

  // 7 days after start date as end date
  const endDateInput = document.querySelector('#endDate') as HTMLInputElement
  const endDate = new Date()
  endDate.setDate(tomorrow.getDate() + 7)
  endDateInput.value = formatDate(endDate)

  // Add event listeners
  addEventListeners(selectedResorts)

  // Listen for messages from the background script
  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    logger.info('Received event in sidebar', { event: request.event })
    setStatus(request.status)
    switch (request.event) {
      case EventList.loggedIn:
        showGetResortsButton()
        showResortListSection()
        hideCheckAvailabilitySection()
        break

      case EventList.updateResortData:
        // Handle the resort data response
        if (request.resorts) {
          listResorts(request.resorts, selectedResorts)
          hideGetResortsButton()
          showCheckAailabilitySection()
          showResortListSection()
        }
        break

      case EventList.updateAvailability:
        if (request.resort) {
          updateResortAvailability(request.resort)
          hideGetResortsButton()
          showCheckAailabilitySection()
          showResortListSection()
        }
        break

      case EventList.logout:
        {
          deleteResortList()
          hideGetResortsButton()
          hideResortListSection()
          hideCheckAvailabilitySection()
        }
        break
      default:
        console.warn(`Unhandled event: ${request.event}`)
    }
  })
}
