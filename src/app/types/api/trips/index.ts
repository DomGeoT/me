import { TripShape } from "../../collections/trips"

export type PostTripRequest = Omit<TripShape, "_id">
export type GetTripsResponse = { trips: TripShape[] }
