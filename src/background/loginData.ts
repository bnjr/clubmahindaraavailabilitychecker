// src/background/loginData.ts
import { logger } from '../common/log'
import { MemberInfo } from './types'
import { isTokenExpired, getExpiryDateFromToken, decrypt } from './utils'

export function resetCustomerDetails() {
  return {
    asfDue: 0,
    emiDue: 0,
    memberLastName: '',
    memberApertment: '',
    memberEmailId: '',
    memberPhoneNo: '',
    memberFirstName: '',
    memberMembershipId: '',
    memberTypeProfileID: '',
    inventoryDaysBalance: '',
    memberSeason: '',
    portalCode: '',
    memberContractId: '',
    memberMiddleName: '',
    contractID: '',
    memberPoints: '',
    contractSeason: '',
    contractApartmentType: '',
    productId: '',
    contactID: '',
    whatsappOptin: '',
    rcpPoints: '',
    member_salutation: '',
    SalePostedDate: new Date(),
    TierName: '',
    TierExpiryDate: new Date(),
    HfrpLoyaltyPoints: 0,
    HFRP_Points_NextTier: 0,
    clubmSelectFlag: true,
    CancellationRequestStatus: '',
    ProfileUpdatedon: new Date(),
    complimentaryProductId: '',
    GuestFee: false,
    MembershipType: '',
    ReservationID: '',
    CheckInDate: '',
    CheckOutDate: '',
    ResortName: '',
    ResortID: '',
    PersonTrav: '',
    Totalpax: '',
    resortImage: '',
    hfrpBalancePoints: 0,
    hfrpPointsCredited: 0,
    memberId: '',
    userId: '',
  }
}

export function getSessionToken(
  requestHeaders: browser.webRequest.HttpHeaders,
  url: string,
  sessionToken: string | undefined
): string | undefined {
  logger.info('===> Session Token extraction initiated')
  // log the url
  logger.info('URL for session token:', url)
  if (sessionToken) {
    if (isTokenExpired(sessionToken)) {
      logger.info('Token has expired. Refreshing...')
      const tokenDate = getExpiryDateFromToken(sessionToken)
      logger.info('Token expiry date:', tokenDate?.toISOString())
    } else {
      logger.info('!!!Token still valid!!!')
      logger.info('Session Token extraction completed ===>')
      return sessionToken
    }
  }

  // Find the Authorization header in the request headers
  const authorizationHeader = requestHeaders?.find(
    (header) => header.name.toLowerCase() === 'authorization'
  )

  if (authorizationHeader) {
    const _sessionToken = authorizationHeader.value ?? ''

    logger.info('Session Token:', { _sessionToken })
    logger.info('Session Token extraction completed ===>')
    return _sessionToken
  } else {
    console.error('Authorization header not found for URL:', url)
  }
}

export function getMemberInfo(
  requestBody: browser.webRequest._OnBeforeRequestDetailsRequestBody,
  url: string,
  memberInfo: MemberInfo | undefined
): MemberInfo | undefined {
  logger.info('===> Member info extraction initiated')
  logger.info('URL for payload extraction:', url)

  if (memberInfo?.memberId) {
    logger.info('!!!Payload already extracted!!!')
    return memberInfo
  }
  if (requestBody && requestBody.raw) {
    // Decode the payload
    const decoder = new TextDecoder('utf-8')

    const body = decoder.decode(requestBody.raw[0].bytes)
    const jsonBody: { encStr: string } = JSON.parse(body)
    const decrypted = decrypt(jsonBody.encStr) as MemberInfo

    memberInfo = {
      memberId: decrypted.memberId,
      portalCode: decrypted.portalCode,
    }
    logger.info('Member info:', memberInfo)
    logger.info('Member info extraction completed ===>')
    return memberInfo
  }
}
