"use client"
import * as React from "react"
import Container from "@mui/material/Container"
import { GetTripResponse } from "../types/api/trips"
import { Button, CircularProgress, Typography } from "@mui/material"
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
        <Container>
            <Marked>{trip.rawMarkdownContent}</Marked>
            <Button onClick={handleDeleteTrip}>Delete</Button>
        </Container>
    )
}
