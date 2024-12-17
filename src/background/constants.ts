// src/background/constants.ts
// Encryption key
export const ENCRYPTION_KEY = 'ABCEDE683E783A327B68C887FDBC1XYZ'
// URLs
export const profileURL =
  'https://newmembers-api.clubmahindra.com/booking/api/v1/getProfileInfo'
export const availabilityURL =
  'https://newmembers-api.clubmahindra.com/booking/api/v1/getAvailabilityCalendar'
export const resortURL =
  'https://newmembers-api.clubmahindra.com/staticdata/api/v1/getResortFilterCR?encStr='
const memberContractIdURL =
  'https://newmembers-api.clubmahindra.com/booking/api/v1/getMemberContracts'

export const MEMBER_USAGE_PER_DAY_VALUE = 161

export const sessionURLs = [
  // 'https://newmembers-api.clubmahindra.com/staticdata/api/v1/getPrivileges*',
  // 'https://newmembers-api.clubmahindra.com/booking/api/v1/getMemberProductDetails*',
  // 'https://newmembers-api.clubmahindra.com/booking/api/v1/loginWithPassword*',
  'https://newmembers-api.clubmahindra.com/booking/api/v1/getProfileDetails*',
  'https://newmembers-api.clubmahindra.com/booking/api/v1/getProfileInfo*',
  // 'https://newmembers-api.clubmahindra.com/booking/api/v1/getCPMemberDetails*',
  // 'https://newmembers-api.clubmahindra.com/booking/api/v1/getMemberProductDetails*',
  // 'https://newmembers-api.clubmahindra.com/booking/api/v1/getMemberContracts*',
]

export const memberURLs = [
  // 'https://newmembers-api.clubmahindra.com/booking/api/v1/getProfileDetails*',
  'https://newmembers-api.clubmahindra.com/booking/api/v1/getProfileInfo*',
  // 'https://newmembers-api.clubmahindra.com/booking/api/v1/getCPMemberDetails*',
  // 'https://newmembers-api.clubmahindra.com/booking/api/v1/getMemberProductDetails*',
  // 'https://newmembers-api.clubmahindra.com/booking/api/v1/loginWithPassword*',
  'https://newmembers-api.clubmahindra.com/booking/api/v1/getMemberContracts*',
]

export const logoutURLs = [
  'https://newmembers-api.clubmahindra.com/booking/api/v1/logout*',
]

export const BATCH_SIZE = 5 // Example batch size
