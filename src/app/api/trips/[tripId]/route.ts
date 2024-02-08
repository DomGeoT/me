import { NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"
import { TripShape } from "@/types/collections/trips"
import { ObjectId } from "mongodb"

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
    const trip = await request.formData()

    // if (
    //     !trip.has("heading") ||
    //     !trip.has("description") ||
    //     !trip.has("rawMarkdownContent") ||
    //     !trip.has("longitude") ||
    //     !trip.has("latitude") ||
    //     !trip.has("image")
    // ) {
    //     return NextResponse.json({}, { status: 400 })
    // }
    const client = await clientPromise
    const db = client.db()
    // const s3 = new S3Client({
    //     region: "eu-north-1",
    // })

    // await s3.config.credentials({ forceRefresh: true })

    // const imageUrls: string[] = []

    // for (const file of trip.getAll("image")) {
    //     const imageFile = file as File

    //     const formattedImageFile = await sharp(await imageFile.arrayBuffer())
    //         .resize(1920)
    //         .webp({ quality: 80 })
    //         .toBuffer()

    //     const id = crypto.randomBytes(24).toString("hex")

    //     const input = {
    //         Body: formattedImageFile,
    //         Bucket: "domgeot-website-images",
    //         Key: id,
    //     }

    //     const uploadCommand = new PutObjectCommand(input)
    //     const res = await s3.send(uploadCommand)

    //     if (res.$metadata.httpStatusCode !== 200) {
    //         console.error("Failed to upload image", res)
    //         continue
    //     }

    //     const publicUrl = `https://domgeot-website-images.s3.eu-north-1.amazonaws.com/${id}`
    //     imageUrls.push(publicUrl)
    // }

    const tripId = new ObjectId(params.tripId)

    const _trip = await db.collection<TripShape>("trips").updateOne(
        // @ts-expect-error not sure why typing fails here
        { _id: tripId },
        {
            heading: trip.get("heading") ?? undefined,
            description: trip.get("description") ?? undefined,
            rawMarkdownContent: trip.get("rawMarkdownContent") ?? undefined,
            // images: imageUrls,
            longitude: trip.get("longitude") ?? undefined,
            latitude: trip.get("latitude") ?? undefined,
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
