import WorldMap from "@/components/travel/WorldMap"
import { GetTripsResponse } from "../types/api/trips"
import * as React from "react"
import { getPassword } from "@/utils"

export function Map() {
    const [tripsFetched, setTripsFetched] = React.useState(false)
    const [trips, setTrips] = React.useState<GetTripsResponse["trips"]>([])
    React.useEffect(() => {
        async function f() {
            const res = await fetch("/api/trips", {
                method: "GET",
                headers: {
                    Authorization: getPassword(),
                },
            })
            setTripsFetched(true)
            if (!res.ok) {
                return
            }
            const body = (await res.json()) as GetTripsResponse
            setTrips(
                body.trips.sort((tripA, tripB) =>
                    tripA.entryDate > tripB.entryDate ? -1 : 1
                ) // order by entry date
            )
        }
        void f()
    }, [])
    if (!tripsFetched) {
        return
    }

    return <WorldMap trips={trips} />
}
