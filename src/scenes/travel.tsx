import * as React from "react"
import { GetTripsResponse } from "../types/api/trips"
import { Box } from "@mui/material"
import { TripPreview } from "@/components/travel/TripPreview"

export default function Travel() {
    const [trips, setTrips] = React.useState<GetTripsResponse["trips"]>([])
    React.useEffect(() => {
        async function f() {
            const res = await fetch("/api/trips", { method: "GET" })
            if (!res.ok) {
                return
            }
            const body = (await res.json()) as GetTripsResponse
            setTrips(
                body.trips.sort((tripA, tripB) => (tripA > tripB ? -1 : 1)) // order by entry date
            )
        }
        void f()
    }, [])

    return (
        <Box>
            <title>Dom Taylor | Travel</title>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "10px", // Adjust the gap size as needed
                }}
            >
                {trips.map((trip) => (
                    <TripPreview
                        key={trip._id}
                        _id={trip._id}
                        images={trip.images}
                        name={trip.heading}
                        description={trip.description}
                        entryDate={new Date(trip.entryDate)}
                    />
                ))}
            </Box>
        </Box>
    )
}
