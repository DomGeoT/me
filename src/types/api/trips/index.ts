import { TripShape } from "../../collections/trips"

export type PostTripRequest = Omit<TripShape, "_id" | "entryDate">
export type PatchTripRequest = Partial<
    Pick<
        TripShape,
        | "heading"
        | "description"
        | "rawMarkdownContent"
        | "longitude"
        | "latitude"
    >
>
export type GetTripsResponse = { trips: TripShape[] }
export type GetTripResponse = { trip: TripShape }
