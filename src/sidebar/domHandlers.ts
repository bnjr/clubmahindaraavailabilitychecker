// src/sidebar/domHandlers.ts
import { toggleVisibility } from './utils'

// src/sidebar/domHandlers.ts
export function setStatus(status: string) {
  const statusElement = document.querySelector('#status')
  if (statusElement) {
    statusElement.textContent = status
  }
}

export function clearResortSelection() {
  const checkboxes = document.querySelectorAll(
    '#resortData input[type="checkbox"]'
  ) as NodeListOf<HTMLInputElement>
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false
  })
}

export function showGetResortsButton() {
  toggleVisibility('getResortsButton', true)
}

export function hideGetResortsButton() {
  toggleVisibility('getResortsButton', false)
}

export function showResortSection() {
  toggleVisibility('resortSection', true)
}

export function hideResortSection() {
  toggleVisibility('resortSection', false)
}

export function showavailabilityFormSection() {
  toggleVisibility('availabilityFormSection', true)
}

export function hideAvailabilityFormSection() {
  toggleVisibility('availabilityFormSection', false)
}
