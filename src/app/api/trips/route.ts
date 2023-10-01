import { NextResponse } from 'next/server'

import clientPromise from '../../lib/mongodb';
import { GetTripsResponse } from '@/app/types/api/trips';
import { TripShape } from '@/app/types/collections/trips';
import { WithId } from 'mongodb';

export async function GET(request: Request) {
    const client = await clientPromise;
    const db = client.db();
    const trips = (await db.collection<TripShape>("trips").find({}).toArray());
    const v = trips.map(x => ({ name: x.name }))

    return NextResponse.json({ trips: v }, { status: 200 })
}


export async function POST(request: Request) {
    const client = await clientPromise;
    const db = client.db();

    const x = await request.json()
    await db.collection("trips").insertOne({ name: x.name });

    return NextResponse.json({}, { status: 200 })

}