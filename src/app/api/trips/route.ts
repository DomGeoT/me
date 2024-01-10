import { NextResponse } from "next/server"
import crypto from "crypto"

import clientPromise from "../../lib/mongodb"
import { TripShape } from "@/types/collections/trips"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

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
    const trip = await request.formData()

    if (
        !trip.has("heading") ||
        !trip.has("description") ||
        !trip.has("rawMarkdownContent") ||
        !trip.has("longitude") ||
        !trip.has("latitude") ||
        !trip.has("image")
    ) {
        return NextResponse.json({}, { status: 400 })
    }
    const client = await clientPromise
    const db = client.db()
    const s3 = new S3Client({
        region: "eu-north-1",
    })

    await s3.config.credentials({ forceRefresh: true })

    const imageUrls: string[] = []

    for (const file of trip.getAll("image")) {
        const imageFile = file as File

        const id = crypto.randomBytes(24).toString("hex")

        const input = {
            Body: Buffer.from(await imageFile.arrayBuffer()),
            Bucket: "domgeot-website-images",
            Key: id,
        }

        const uploadCommand = new PutObjectCommand(input)
        const res = await s3.send(uploadCommand)

        if (res.$metadata.httpStatusCode !== 200) {
            console.error("Failed to upload image", res)
            continue
        }

        const publicUrl = `https://domgeot-website-images.s3.eu-north-1.amazonaws.com/${id}`
        imageUrls.push(publicUrl)
    }

    const result = await db.collection("trips").insertOne({
        heading: trip.get("heading"),
        description: trip.get("description"),
        rawMarkdownContent: trip.get("rawMarkdownContent"),
        images: imageUrls,
        longitude: trip.get("longitude"),
        latitude: trip.get("latitude"),
        entryDate: Date.now(),
    })

    return NextResponse.json(
        { id: result.insertedId.toString() },
        { status: 200 }
    )
}
