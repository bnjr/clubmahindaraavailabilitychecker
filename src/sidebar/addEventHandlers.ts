// src/sidebar/addEventHandlers.ts
import { clearResortSelection } from './domHandlers'
import { EventList, AvailabilityList } from '../common/types'
import { logger } from '../common/log'

export function addEventListeners(selectedResorts: any[]): void {
  // Create reset button
  const resetButton = document.querySelector('#resetButton')
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      // Clear resort status
      const statusSpans = document.querySelectorAll('#resortData span')
      statusSpans.forEach((span) => {
        span.textContent = 'Availability: ' + AvailabilityList.unknown // Display the initial status
        span.className = 'availability-unknown' // Set the status color class
      })

      // Uncheck all resorts
      clearResortSelection()

      // Empty the selectedResorts array
      selectedResorts.length = 0
    })
  }

  // Create uncheckAllButton Button
  const uncheckAllButton = document.querySelector('#uncheckAllButton')
  if (uncheckAllButton) {
    uncheckAllButton.addEventListener('click', () => {
      clearResortSelection()

      // Empty the selectedResorts array
      selectedResorts.length = 0
    })
  }

  // Create Check Availability Button
  const checkAvailabilityButton = document.querySelector(
    '#checkAvailabilityButton'
  )
  if (checkAvailabilityButton) {
    checkAvailabilityButton.addEventListener('click', () => {
      const startDateInput = document.querySelector(
        '#startDate'
      ) as HTMLInputElement
      const endDateInput = document.querySelector(
        '#endDate'
      ) as HTMLInputElement

      if (!startDateInput || !endDateInput) return
      const startDate = new Date(startDateInput.value)
      const endDate = new Date(endDateInput.value)
      const tomorrow = new Date()
      tomorrow.setDate(new Date().getDate() + 1)

      // Set hours, minutes, seconds, and milliseconds to 0 for date comparison
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(0, 0, 0, 0)
      tomorrow.setHours(0, 0, 0, 0)

      if (startDate < tomorrow)
        return alert('Start date must be no earlier than tomorrow.')
      if (endDate <= startDate)
        return alert('End date must be later than start date.')
      if (selectedResorts.length === 0)
        return alert('Please select at least one resort.')
      if (selectedResorts.length > 10)
        return alert('You can select a maximum of 10 resorts.')

      browser.runtime.sendMessage({
        event: EventList.checkAvailability,
        startDate: startDate.toISOString().slice(0, 10), // Convert back to YYYY-MM-DD format
        endDate: endDate.toISOString().slice(0, 10),
        resorts: selectedResorts,
      })
    })
  }

  // Create Get Resort Button
  const getResortsButton = document.querySelector('#getResortsButton')
  if (getResortsButton) {
    getResortsButton.addEventListener('click', () => {
      logger.info('Sending getResortData event')
      browser.runtime.sendMessage({
        event: EventList.getResortData,
      })
    })
  }
}
