import { TripShape } from "../../collections/trips"

export type PostTripRequest = Omit<TripShape, "_id" | "entryDate">
export type GetTripsResponse = { trips: TripShape[] }
export type GetTripResponse = { trip: TripShape }
