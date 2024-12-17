// src/background.ts
import { AppData } from './background/types'
import {
  getSessionToken,
  getMemberInfo,
  resetCustomerDetails,
} from './background/loginData'
import { updateSidebar } from './background/sidebarComm'
import {
  logout,
  checkAvailability,
  getCustomerDetails,
  getResorts,
} from './background/actions'
import { EventList } from './common/types'
import {
  memberURLs,
  sessionURLs,
  BATCH_SIZE,
  logoutURLs,
} from './background/constants'
import { logger } from './common/log'

const appData: AppData = {
  userLoggedIn: false,
  resorts: undefined,
  customerDetails: resetCustomerDetails(),
  memberInfo: undefined,
  sessionToken: undefined,
}

browser.runtime.onInstalled.addListener(() => {
  browser.browserAction.setBadgeBackgroundColor({ color: '#4688F1' }) // Set the badge color
})

// 1. Get session token
browser.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    if (details.requestHeaders && details.url)
      appData.sessionToken = getSessionToken(
        details.requestHeaders,
        details.url,
        appData.sessionToken
      )
    return
  },
  {
    urls: sessionURLs, // Only intercept these URLs
  },
  ['requestHeaders']
)

// 2. Extract payload
browser.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.method === 'POST') {
      // Extract the payload from the request body
      const requestBody = details.requestBody
      if (requestBody && !appData.memberInfo?.memberId) {
        appData.memberInfo = getMemberInfo(
          requestBody,
          details.url,
          appData.memberInfo
        )
        if (appData.memberInfo?.memberId) {
          logger.info('Membership received, update sidebar')
          updateSidebar(EventList.loggedIn)
        } else console.error('Membership not received')
      }
    }
  },
  {
    urls: memberURLs,
  },
  ['requestBody']
)

// 3. Listen for logout message
browser.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    if (details.url) {
      logout(details.url, appData)
      updateSidebar(EventList.logout)
    }
    return
  },
  { urls: logoutURLs },
  ['requestHeaders']
)

// 4. User generated events are received here
browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  logger.info('Received message in background', {
    event: request.event,
  })
  switch (request.event) {
    case EventList.checkAvailability:
      try {
        await processInBatches(request.resorts, BATCH_SIZE, async (resort) => {
          try {
            const resortStatus = await checkAvailability(
              request.startDate,
              request.endDate,
              resort,
              appData.sessionToken,
              appData.customerDetails
            )
            logger.info('checkAvailability API response result:', {
              resortStatus: resortStatus.resort_name,
            })
            updateSidebar(EventList.updateAvailability, undefined, resortStatus)
          } catch (error) {
            handleTokenExpiry(error, 'Check availability of Resort')
          }
        })
        logger.info('All resort availability checks completed.')
      } catch (error) {
        console.error('Error in checkAvailability process:', error)
      }
      break

    case EventList.getResortData:
      try {
        const fetchedCustomerDetails = await getCustomerDetails(
          'from sidebar',
          appData.customerDetails,
          appData.sessionToken,
          appData.memberInfo
        )
        logger.info('getCustomerDetails API response result:', {
          memberId: fetchedCustomerDetails.memberId,
        })

        appData.customerDetails = fetchedCustomerDetails
        const fetchedResorts = await getResorts(
          appData.resorts,
          appData.sessionToken,
          appData.customerDetails
        )

        appData.resorts = fetchedResorts

        logger.info('getResorts API response result:', {
          resort: appData.resorts
            ? appData.resorts['North']
              ? Object.keys(appData.resorts['North'])
              : 'No Resort Available'
            : 'No Resort Available',
        })
        updateSidebar(EventList.updateResortData, appData.resorts)
      } catch (error) {
        handleTokenExpiry(error, 'Retrieve resort data')
      }
      break
    default:
      console.error(`Unknown event: ${request.event}`)
      break
  }
})

// Utility function to handle token expiry in catch blocks
function handleTokenExpiry(error: Error, action: string) {
  if (error.message.includes('Token is Expired')) {
    console.error(`${action} failed: Token is Expired`)
    logout(action, appData)
    updateSidebar(EventList.logout)
  } else {
    console.error(`${action} Error:`, error)
  }
}

// Batch processing helper
async function processInBatches(items, batchSize, callback) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    await Promise.all(batch.map(callback))
  }
}
