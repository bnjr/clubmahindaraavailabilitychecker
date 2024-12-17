// src/sidebar/resortOperations.ts
import { Resort, AvailabilityList } from '../common/types'

export function listResorts(resorts, selectedResorts) {
  const resortDataDiv = document.querySelector('#resortData')
  if (!resortDataDiv) return

  resortDataDiv.textContent = '' // Clear previous content

  for (const region in resorts) {
    if (region !== 'zoneCount' && region !== 'stateImage') {
      const regionHeader = document.createElement('h2')
      regionHeader.classList.add('regionHeader', 'expanded') // Initially expanded
      regionHeader.textContent = region

      const regionContainer = document.createElement('div')
      regionContainer.classList.add('regionContainer')

      for (const state in resorts[region]) {
        const stateContainer = document.createElement('div')
        stateContainer.classList.add('stateContainer')

        const stateHeader = document.createElement('h3')
        stateHeader.classList.add('stateHeader')
        const stateCheckbox = createStateCheckbox(
          resorts[region][state],
          selectedResorts
        )

        stateHeader.textContent = state
        stateHeader.prepend(stateCheckbox)

        const resortList = document.createElement('ul')
        resortList.classList.add('resortList', 'hidden') // Collapsed by default

        resorts[region][state].forEach((resort) => {
          resortList.append(
            createResortItem(resort, stateCheckbox, selectedResorts)
          )
        })

        // Build the state container
        stateContainer.appendChild(stateHeader)
        stateContainer.appendChild(resortList)

        regionContainer.appendChild(stateContainer)
      }

      resortDataDiv.append(regionHeader, regionContainer)

      // Region Toggle: Show/Hide states
      regionHeader.addEventListener('click', () => {
        regionContainer.classList.toggle('hidden')
        regionHeader.classList.toggle('expanded') // Add or remove the expanded class
      })

      // State Toggle: Show/Hide resorts
      regionContainer.querySelectorAll('.stateHeader').forEach((header) => {
        header.addEventListener('click', (event) => {
          event.stopPropagation()
          const resortList = header.parentElement?.querySelector('.resortList')
          if (resortList) {
            resortList.classList.toggle('hidden')
            header.classList.toggle('expanded') // Add or remove the expanded class
          }
        })
      })
    }
  }
}

// function to delete resort list after logout
export function deleteResortList(): void {
  const resortDataDiv = document.getElementById('resortData')
  if (!resortDataDiv) {
    return
  }
  resortDataDiv.innerHTML = ''
}

// Update resort avaliability
export function updateResortAvailability(resort: Resort) {
  const statusSpan = document.getElementById(`resortStatus${resort.crest_id}`)

  if (statusSpan) {
    statusSpan.textContent = `${resort.status}`

    // Update class based on status
    switch (resort.status) {
      case AvailabilityList.available:
        statusSpan.className = 'availability-available'
        break
      case AvailabilityList.waitlist:
        statusSpan.className = 'availability-waitlist'
        break
      case AvailabilityList.unavailable:
        statusSpan.className = 'availability-unavailable'
        break
      default:
        statusSpan.className = 'availability-unknown'
        statusSpan.textContent = `Availability: ${AvailabilityList.unknown}`
    }
  }
}

function createStateCheckbox(stateResorts, selectedResorts: any[]) {
  const stateCheckbox = document.createElement('input')
  stateCheckbox.type = 'checkbox'

  stateCheckbox.addEventListener('change', (event) => {
    // When the state checkbox is toggled, check/uncheck all resort checkboxes
    stateResorts.forEach((resort) => {
      const resortCheckbox = document.querySelector(
        `#resort${resort.crest_id}`
      ) as HTMLInputElement
      if (resortCheckbox) {
        resortCheckbox.checked = (event.target as HTMLInputElement).checked
        const resortIndex = selectedResorts.indexOf(resort)
        if ((event.target as HTMLInputElement).checked && resortIndex === -1) {
          selectedResorts.push(resort)
        } else if (
          !(event.target as HTMLInputElement).checked &&
          resortIndex > -1
        ) {
          selectedResorts.splice(resortIndex, 1)
        }
      }
    })
  })

  return stateCheckbox
}

function createResortItem(
  resort: Resort,
  stateCheckbox: HTMLInputElement,
  selectedResorts: any[]
) {
  const resortItem = document.createElement('li')
  resortItem.id = `resortItem${resort.crest_id}`
  const checkbox = document.createElement('input')
  const label = document.createElement('label')
  const statusSpan = document.createElement('span') // Create a span for the status
  const lineBreak = document.createElement('br')

  checkbox.type = 'checkbox'
  checkbox.value = resort.crest_id
  checkbox.id = `resort${resort.crest_id}`

  checkbox.addEventListener('change', (event) => {
    // Prevent event from propagating to parent elements
    event.stopPropagation()

    const resortIndex = selectedResorts.indexOf(resort)
    if ((event.target as HTMLInputElement).checked) {
      selectedResorts.push(resort)
    } else {
      resortIndex > -1 && selectedResorts.splice(resortIndex, 1)
      stateCheckbox.checked = false
    }
  })

  label.htmlFor = `resort${resort.crest_id}`
  label.textContent = resort.resort_name

  statusSpan.textContent =
    ' Availability: ' + (resort.status || AvailabilityList.unknown) // Display the initial status
  statusSpan.id = `resortStatus${resort.crest_id}` // Give the status span a unique ID

  resortItem.append(checkbox, label, lineBreak, statusSpan)

  return resortItem
}
