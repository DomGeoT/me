import * as React from "react"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import { GetTripsResponse } from "../types/api/trips"
import { IconButton } from "@mui/material"
import { Add } from "@mui/icons-material"
import { NewTripModal } from "@/components"
import { TripPreview } from "@/components/travel/TripPreview"

export default function Travel() {
    const [trips, setTrips] = React.useState<GetTripsResponse["trips"]>([])
    const [tripsModalOpen, setTripsModalOpen] = React.useState(false)
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

    const handleToggleTripsModal = React.useCallback(() => {
        setTripsModalOpen((state) => !state)
    }, [])

    return (
        <Container>
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
                        previewImage="https://rimage.gnst.jp/livejapan.com/public/article/detail/a/00/02/a0002779/img/basic/a0002779_main.jpg?20201225174832"
                        name={trip.heading}
                        description={trip.description}
                        entryDate={new Date(trip.entryDate)}
                    />
                ))}
            </Box>
            <IconButton
                onClick={handleToggleTripsModal}
                disabled={tripsModalOpen}
                sx={{
                    position: "fixed",
                    bottom: "32px",
                    right: "32px",
                }}
            >
                <Add />
            </IconButton>
            <NewTripModal
                open={tripsModalOpen}
                onClose={handleToggleTripsModal}
            />
        </Container>
    )
}
