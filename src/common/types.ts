// src/types.ts

// Event List
export enum EventList {
  loggedIn = 'LOGGEDIN',
  logout = 'LOGOUT',
  getResortData = 'GETRESORTDATA',
  updateResortData = 'UPDATERESORTDATA',
  updateAvailability = 'UPDAVAILABILITY',
  checkAvailability = 'CHECKAVAILABILITY',
}

// Resort Availability Status
export enum AvailabilityList {
  available = 'Available',
  waitlist = 'Waitlist',
  unavailable = 'Unavailable',
  unknown = 'Unknown',
}

// Type Definitions
// Type for individual resort details
export interface Resort {
  id: string
  crest_id: string
  resort_name: string
  resort_banner: string
  city: string
  state: string
  zone: string
  latitude: string
  longitude: string
  guest_booking_allow: string
  terrain: string // This is a stringified array of terrains
  experience_segregation: string
  country: string
  prospect_redirect_url: string
  associated_resort: string
  resort_zone: string
  status: AvailabilityList
}

// Type for state-specific resorts
type StateResorts = Record<string, Resort[]>
// Type for the entire resort response
export interface Resorts {
  [region: string]: StateResorts
}

// Type for terrain details
interface Terrain {
  id: number
  terrain: string
  weight: number
  status: number
}
