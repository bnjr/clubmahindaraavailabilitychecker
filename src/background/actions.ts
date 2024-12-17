// src/background/actions.ts
import {
  profileURL,
  resortURL,
  availabilityURL,
  MEMBER_USAGE_PER_DAY_VALUE,
} from './constants'
import { CustomerDetails, AppData, MemberInfo, RoomDataByDate } from './types'
import { encrypt, decrypt, isTokenExpired } from './utils'
import { resetCustomerDetails } from './loginData'
import { Resorts, Resort, AvailabilityList } from '../common/types'
import { logger } from '../common/log'

export async function getCustomerDetails(
  url: string,
  customerDetails: CustomerDetails | undefined,
  sessionToken: string | undefined,
  memberInfo: MemberInfo | undefined
): Promise<CustomerDetails> {
  logger.info('===> Get Customer details initiated')
  logger.info('URL for get customer details:', url)

  // Early return if customer details are already available
  if (customerDetails?.memberId) {
    logger.info('!!!Customer details already in hand!!!')
    logger.info('Get Customer details completed ===>')
    return customerDetails
  }

  // Validate input parameters
  if (!sessionToken) {
    console.error('Get Customer details failed: No session token')
    logger.info('Get Customer details completed ===>')
    throw new Error('No session token')
  }

  if (isTokenExpired(sessionToken)) {
    console.error('Get Customer details failed: Token is Expired')
    logger.info('Get Customer details completed ===>')
    throw new Error('Token is Expired')
  }

  if (!memberInfo?.memberId) {
    console.error('Get Customer details failed: No member id')
    logger.info('Get Customer details completed ===>')
    throw new Error('No member id')
  }

  // Encrypt memberInfo payload
  const encrypted = encrypt(memberInfo)
  const newRequestBody = JSON.stringify({ encStr: encrypted })

  try {
    // Make the fetch request
    const response = await fetch(profileURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${sessionToken}`,
        Accept: 'application/json, text/plain, */*',
        Referer: 'https://holidays.clubmahindra.com',
      },
      credentials: 'include',
      body: newRequestBody,
      mode: 'cors',
    })

    // Check HTTP response status
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Check application-level response status
    if (data.status !== 'success') {
      console.error('Error in getting Customer details', data)
      throw new Error(data.message || 'Error in getting Customer details')
    }

    // Decrypt and return the customer details
    const decryptedCustomerDetails = decrypt(data.data) as CustomerDetails
    logger.info('Customer Details:', {
      memberId: decryptedCustomerDetails.memberId,
    })
    logger.info('Get Customer details completed ===>')
    return decryptedCustomerDetails
  } catch (error) {
    console.error('Fetch error:', error)
    throw error // Propagate the error to the caller
  }
}

export async function getResorts(
  resorts: Resorts | undefined,
  sessionToken: string | undefined,
  customerDetails: CustomerDetails | undefined
): Promise<Resorts> {
  logger.info('===> Fetch resorts initiated')

  // Early return if resorts are already available
  if (resorts) {
    logger.info('!!!Resort details already in hand!!!')
    logger.info('Fetch resorts completed ===>')
    return resorts
  }

  // Validate input parameters
  if (!sessionToken) {
    console.error('Fetch resorts failed: No session token')
    logger.info('Fetch resorts completed ===>')
    throw new Error('No session token')
  }

  if (isTokenExpired(sessionToken)) {
    console.error('Fetch resorts failed: Token Expired')
    logger.info('Fetch resorts completed ===>')
    throw new Error('Token is Expired')
  }

  if (!customerDetails?.memberId) {
    console.error('Fetch resorts failed: No member id')
    logger.info('Fetch resorts completed ===>')
    throw new Error('No member id')
  }

  // Encrypt parameters
  const encryptedValue = encrypt({
    portalCode: customerDetails.portalCode,
    memberId: customerDetails.memberId,
    membershipId: customerDetails.memberMembershipId,
  })

  // Construct the fetch URL
  const url = `${resortURL}${encryptedValue}`

  try {
    // Fetch resorts data
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `${sessionToken}`,
        Accept: 'application/json, text/plain, */*',
      },
      credentials: 'include',
      mode: 'cors',
    })

    // Handle non-OK HTTP responses
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Handle application-level errors
    if (data.status !== 'success') {
      console.error('Error in getting Resort list', data)
      throw new Error(data.message || 'Failed to fetch resort data')
    }

    // Decrypt and return the resort data
    const decryptedResortData = decrypt(data.data) as Resorts
    logger.info('Resort list received', {
      resort: decryptedResortData['North']
        ? Object.keys(decryptedResortData['North'])
        : 'No Resort Available',
    })
    logger.info('Fetch resorts completed ===>')
    return decryptedResortData
  } catch (error) {
    console.error('Error in fetching resorts', error)
    throw error
  }
}

export async function checkAvailability(
  startDate: string,
  endDate: string,
  resort: Resort,
  sessionToken: string | undefined,
  customerDetails: CustomerDetails | undefined
): Promise<Resort> {
  logger.info('===> Check availability initiated')
  let errorMessage = ''

  if (!sessionToken) {
    errorMessage = 'No session token'
  } else if (isTokenExpired(sessionToken)) {
    errorMessage = 'Token is Expired'
  }

  if (!customerDetails?.memberId) {
    errorMessage += 'No member id, '
  }

  if (!(startDate && endDate && resort.crest_id)) {
    if (!startDate) errorMessage += 'Missing start date, '
    if (!endDate) errorMessage += 'Missing end date, '
    if (!resort.crest_id) errorMessage += 'Missing CrestID'
  }

  if (errorMessage) {
    console.error('Check availability failed:', errorMessage)
    logger.info('Check availability completed ===>')
    throw new Error(errorMessage.trim())
  }

  const payload = {
    checkIn: startDate,
    checkOut: endDate,
    crestId: resort.crest_id,
    memberSeason: customerDetails?.memberSeason,
    memberId: customerDetails?.memberId,
    membershipId: customerDetails?.memberMembershipId,
    adult: 2,
    child: 0,
    infant: 0,
    apartmentType: customerDetails?.memberApertment,
    memberUsagePerDayValue: MEMBER_USAGE_PER_DAY_VALUE,
    memberProfileId: customerDetails?.memberTypeProfileID,
    portalCode: customerDetails?.portalCode,
    contractId: customerDetails?.contactID,
    productId: customerDetails?.productId,
  }

  const encrypted = encrypt(payload)
  const newRequestBody = {
    encStr: encrypted,
  }

  const newBodyString = JSON.stringify(newRequestBody)

  try {
    const response = await fetch(availabilityURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${sessionToken}`,
        Accept: 'application/json, text/plain, */*',
        Referer: 'https://holidays.clubmahindra.com',
      },
      credentials: 'include',
      body: newBodyString,
      mode: 'cors',
    })

    const data = await response.json()

    if (data.status === 'success') {
      const decryptedData: RoomDataByDate = decrypt(data.data) as RoomDataByDate
      const status = determineResortStatus(decryptedData, startDate, endDate)
      const resortStatus = { ...resort, status }
      logger.info('Check availability completed ===>')
      return resortStatus
    } else {
      console.error('Error in Check availability', data)
      throw new Error(data.message || 'Unknown error occurred')
    }
  } catch (error) {
    console.error('Error in Check availability', error)
    throw error
  }
}

function determineResortStatus(
  roomsPerDay: RoomDataByDate,
  startDate,
  endDate
): AvailabilityList {
  // Assume the status is 'Available' and update if necessary
  let availability: AvailabilityList = AvailabilityList.available

  // Convert string dates to Date objects for comparison
  const start = new Date(startDate)
  const end = new Date(endDate)

  // Iterate over each day in the data
  for (let day in roomsPerDay) {
    // Only process the days within the specified date range
    const currentDay = new Date(day)
    if (currentDay >= start && currentDay <= end) {
      let rooms = roomsPerDay[day]
      let available = rooms.some((room) => room.Status === 'A')
      let waitlisted = rooms.some((room) => room.Status === 'N')

      if (!available && !waitlisted) {
        // If there are no rooms available or on waitlist for this day, the resort is 'Sold Out'
        return AvailabilityList.unavailable
      } else if (
        !available &&
        waitlisted &&
        (availability === AvailabilityList.available ||
          availability === AvailabilityList.waitlist)
      ) {
        // If there are no rooms available but there is a room on waitlist for this day, and the resort is not already 'Sold Out',
        // the resort is on 'Waitlist'
        availability = AvailabilityList.waitlist
      }
    }
  }

  return availability
}

export function logout(url: string, appData: AppData) {
  logger.info('===> Logout initiated')
  logger.info('Logout URL:', url)

  if (
    appData.userLoggedIn ||
    appData.sessionToken ||
    appData.resorts ||
    appData.memberInfo?.memberId ||
    appData.customerDetails?.memberId
  ) {
    // reset app data
    appData.sessionToken = ''
    appData.userLoggedIn = false
    appData.resorts = undefined
    appData.customerDetails = resetCustomerDetails()
    appData.memberInfo = undefined
    logger.info('Logout completed ===>')
  }
}
