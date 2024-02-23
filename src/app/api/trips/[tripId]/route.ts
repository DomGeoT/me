import { NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"
import { TripShape } from "@/types/collections/trips"
import { ObjectId } from "mongodb"
import { PatchTripRequest } from "@/types/api/trips"

export async function GET(
    request: Request,
    { params }: { params: { tripId: string } }
) {
    const client = await clientPromise
    const db = client.db()

    const tripId = new ObjectId(params.tripId)

    const _trip = await db
        .collection<TripShape>("trips")
        // @ts-expect-error not sure why typing fails here
        .findOne({ _id: tripId })

    if (!_trip) {
        return NextResponse.json({}, { status: 404 })
    }

    const trip = {
        _id: _trip._id,
        heading: _trip.heading,
        rawMarkdownContent: _trip.rawMarkdownContent,
        description: _trip.description,
        images: _trip.images,
        longitude: _trip.longitude,
        latitude: _trip.latitude,
        entryDate: new Date(_trip.entryDate),
    }

    return NextResponse.json({ trip }, { status: 200 })
}

export async function PATCH(
    request: Request,
    { params }: { params: { tripId: string } }
) {
    const trip = (await request.json()) as PatchTripRequest

    const client = await clientPromise
    const db = client.db()

    const tripId = new ObjectId(params.tripId)

    const _trip = await db.collection<TripShape>("trips").updateOne(
        // @ts-expect-error not sure why typing fails here
        { _id: tripId },
        {
            $set: {
                heading: trip.heading ?? undefined,
                description: trip.description ?? undefined,
                rawMarkdownContent: trip.rawMarkdownContent ?? undefined,
                longitude: trip.longitude ?? undefined,
                latitude: trip.latitude ?? undefined,
            },
        }
    )

    if (_trip.matchedCount === 0) {
        return NextResponse.json({}, { status: 503 })
    }
    return NextResponse.json({}, { status: 200 })
}

export async function DELETE(
    request: Request,
    { params }: { params: { tripId: string } }
) {
    const client = await clientPromise
    const db = client.db()

    const tripId = new ObjectId(params.tripId)

    const result = await db
        .collection<TripShape>("trips")
        // @ts-expect-error not sure why typing fails here
        .deleteOne({ _id: tripId })

    if (result.deletedCount === 0) {
        return NextResponse.json({}, { status: 404 })
    }

    return NextResponse.json({}, { status: 200 })
}
