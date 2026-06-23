import { TripShape } from "@/types/collections/trips"
import { MongoClient } from "mongodb"

const TRIPS: TripShape[] = [
    {
        _id: "a",
        description: "Description A",
        entryDate: new Date(),
        heading: "Heading A",
        images: [""],
        latitude: 1,
        longitude: 1,
        rawMarkdownContent: "## heading",
        privatePost: false,
    },
    {
        _id: "b",
        description: "Description B",
        entryDate: new Date(),
        heading: "Heading B",
        images: [""],
        latitude: 10,
        longitude: 1,
        rawMarkdownContent: "## heading",
        privatePost: false,
    },
    {
        _id: "b",
        description: "Description C",
        entryDate: new Date(),
        heading: "Heading C",
        images: [""],
        latitude: 10,
        longitude: 10,
        rawMarkdownContent: "## heading",
        privatePost: false,
    },
    {
        _id: "d",
        description: "Description D",
        entryDate: new Date(),
        heading: "Heading D",
        images: [""],
        latitude: 1,
        longitude: 10,
        rawMarkdownContent: "## heading",
        privatePost: false,
    },
]

export async function stubMongoDB(): Promise<MongoClient> {
    const stubMongoClient = {
        db: () => ({
            collection: () => ({
                find: () => ({
                    toArray: () => TRIPS,
                }),
            }),
        }),
    } as unknown as MongoClient

    return stubMongoClient
}
