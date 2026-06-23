import { TripShape } from "@/types/collections/trips"
import { Condition, MongoClient, ObjectId } from "mongodb"

const TRIPS: TripShape[] = [
    {
        _id: new ObjectId("aaaaaaaaaaaaaaaaaaaaaaaa").toString(),
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
        _id: new ObjectId("bbbbbbbbbbbbbbbbbbbbbbbb").toString(),
        description: "Description B",
        entryDate: new Date(),
        heading: "Heading B",
        images: [""],
        latitude: 10,
        longitude: 1,
        rawMarkdownContent: "## heading",
        privatePost: false,
        tripName: "a",
    },
    {
        _id: new ObjectId("cccccccccccccccccccccccc").toString(),
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
        _id: new ObjectId("dddddddddddddddddddddddd").toString(),
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
                findOne: ({ _id }: { _id: Condition<string> }) => {
                    return TRIPS.find((trip) => {
                        return trip._id.toString() === _id.toString()
                    })
                },
            }),
        }),
    } as unknown as MongoClient

    return stubMongoClient
}
