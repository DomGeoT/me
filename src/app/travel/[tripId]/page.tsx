"use client"
import * as React from "react"
import Trip from "@/scenes/trip"
import { useParams } from "next/navigation"

export default function TripPage() {
    const params = useParams()
    const tripId = params["tripId"] as string

    return (
        <>
            <title>Dom Taylor | Trip</title>
            <Trip tripId={tripId} />
        </>
    )
}
