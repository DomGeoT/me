import * as React from "react"
import { GetTripsResponse } from "../types/api/trips"
import { Box, Typography } from "@mui/material"
import {
    TripPreview,
    TripPreviewSkeleton,
} from "@/components/travel/TripPreview"
import { getPassword } from "@/utils"

export default function Travel() {
    const [tripsFetched, setTripsFetched] = React.useState(false)
    const [trips, setTrips] = React.useState<GetTripsResponse["trips"]>([])
    React.useEffect(() => {
        async function f() {
            const res = await fetch("/api/trips", {
                method: "GET",
                headers: {
                    Authorization: getPassword(),
                },
            })
            setTripsFetched(true)
            if (!res.ok) {
                return
            }
            const body = (await res.json()) as GetTripsResponse
            setTrips(
                body.trips.sort((tripA, tripB) =>
                    tripA.entryDate > tripB.entryDate ? -1 : 1
                ) // order by entry date
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
                {!tripsFetched &&
                    [...Array.from(Array(10).keys())].map((i) => (
                        <TripPreviewSkeleton key={i} />
                    ))}
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
            {tripsFetched && trips.length === 0 && (
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                    }}
                >
                    <Typography>No trips found...</Typography>
                </Box>
            )}
        </Box>
    )
}
