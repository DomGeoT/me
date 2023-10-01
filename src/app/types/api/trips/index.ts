import { TripShape } from "../../collections/trips";

export type PostTripRequest = TripShape
export type GetTripsResponse = { trips: TripShape[] }