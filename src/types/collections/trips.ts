export type TripShape = {
    _id: string
    heading: string
    description: string
    rawMarkdownContent: string
    images: string[]
    longitude: number
    latitude: number
    privatePost?: boolean
    entryDate: Date
}
