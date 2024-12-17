// src/background/types.ts
import { Resorts } from '../sidebar/types'

export type AppData = {
  userLoggedIn: boolean
  sessionToken: string | undefined
  resorts: Resorts | undefined
  customerDetails: CustomerDetails | undefined
  memberInfo: MemberInfo | undefined
}

export type RoomData = {
  RmtypeID: string
  RoomType: string
  Date: string
  NoofRooms: string
  Status: string
  Season: string
  Reason: string
  ResortID: string
  RoomLeft: string
  StopsaleReason: string
  Upgrade: string
  TotalMemberDaysRequired: number
}

export type RoomDataByDate = Record<string, RoomData[]>

export type MemberInfo = {
  memberId: string
  portalCode: string
}

export type CustomerDetails = {
  userId: string
  memberId: string
  memberSeason: string
  hfrpPointsCredited: number
  hfrpBalancePoints: number
  memberApertment: string
  memberMembershipId: string
  memberContractId: string
  memberFirstName: string
  memberMiddleName: string
  memberLastName: string
  memberTypeProfileID: string
  inventoryDaysBalance: string
  memberEmailId: string
  memberPhoneNo: string
  portalCode: string
  contractID: string
  asfDue: number
  emiDue: number
  memberPoints: string
  contractSeason: string
  contractApartmentType: string
  productId: string
  contactID: string
  whatsappOptin: string
  rcpPoints: string
  member_salutation: string
  SalePostedDate: Date
  TierName: string
  TierExpiryDate: Date
  HfrpLoyaltyPoints: number
  HFRP_Points_NextTier: number
  clubmSelectFlag: boolean
  CancellationRequestStatus: string
  ProfileUpdatedon: Date
  complimentaryProductId: string
  GuestFee: boolean
  MembershipType: string
  ReservationID: string
  CheckInDate: string
  CheckOutDate: string
  ResortName: string
  ResortID: string
  PersonTrav: string
  Totalpax: string
  resortImage: string
}
