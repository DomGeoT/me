"use client"
import * as React from "react"
import { GetTripResponse } from "../types/api/trips"
import { Box, Button, CircularProgress, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import Marked from "marked-react"

type Props = Readonly<{ tripId: string }>

export default function Travel({ tripId }: Props) {
    const router = useRouter()
    const [trip, setTrip] = React.useState<GetTripResponse["trip"]>()
    const [loading, setLoading] = React.useState(true)
    React.useEffect(() => {
        async function f() {
            setLoading(true)
            const res = await fetch(`/api/trips/${tripId}`, { method: "GET" })
            if (!res.ok) {
                setLoading(false)
                return
            }
            const body = (await res.json()) as GetTripResponse
            setTrip({ ...body.trip, entryDate: new Date(body.trip.entryDate) })
            setLoading(false)
        }
        void f()
    }, [])

    const handleDeleteTrip = React.useCallback(async () => {
        setLoading(true)
        const res = await fetch(`/api/trips/${tripId}`, { method: "DELETE" })
        if (!res.ok) {
            setLoading(false)
            return
        }
        router.back()
    }, [])

    if (loading) {
        return <CircularProgress />
    }
    if (!trip) {
        return <Typography>Sorry we could not find the trip...</Typography>
    }

    return (
        <Box style={{ position: "relative" }}>
            {trip.images?.length > 0 && (
                <img
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        minHeight: "70vh",
                        objectFit: "contain", // This property will maintain the aspect ratio
                    }}
                    src={trip.images[0]}
                />
            )}
            <Box
                sx={{
                    position: "absolute",
                    width: "100%",
                    top: trip.images?.length > 0 ? "70vh" : undefined,
                    zIndex: 1, // Put it above the image
                    backgroundColor: "background.paper",
                    marginBottom: "200px",
                    padding: "30px",
                    borderRadius: "10px",
                }}
            >
                <Marked>{trip.rawMarkdownContent}</Marked>
                <Button onClick={handleDeleteTrip}>Delete</Button>
            </Box>
        </Box>
    )
}
