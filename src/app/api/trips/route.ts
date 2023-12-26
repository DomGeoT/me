import { NextResponse } from "next/server"

import clientPromise from "../../lib/mongodb"
import { TripShape } from "@/types/collections/trips"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
    const client = await clientPromise
    const db = client.db()
    const trips = await db.collection<TripShape>("trips").find({}).toArray()
    const tripMapping = trips.map((trip) => ({
        _id: trip._id,
        heading: trip.heading,
        description: trip.description,
        rawMarkdownContent: trip.rawMarkdownContent,
        images: trip.images,
        longitude: trip.longitude,
        latitude: trip.latitude,
        entryDate: new Date(trip.entryDate),
    }))

    return NextResponse.json({ trips: tripMapping }, { status: 200 })
}

export async function POST(request: Request) {
    const client = await clientPromise
    const db = client.db()

    const trip = await request.json()

    if (
        !trip.heading ||
        !trip.description ||
        !trip.rawMarkdownContent ||
        !trip.longitude ||
        !trip.latitude ||
        !trip.images ||
        trip.images.length === 0
    ) {
        return NextResponse.json({}, { status: 400 })
    }

    const result = await db.collection("trips").insertOne({
        heading: trip.heading,
        description: trip.description,
        rawMarkdownContent: trip.rawMarkdownContent,
        images: trip.images,
        longitude: trip.longitude,
        latitude: trip.latitude,
        entryDate: Date.now(),
    })

    return NextResponse.json({ id: result.insertedId.id }, { status: 200 })
}
