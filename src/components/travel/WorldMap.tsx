"use client"
import React, { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Box } from "@mui/material"
import { mapData } from "./mapData"
import { TripShape } from "@/types/collections/trips"
import { TripPreview } from "./TripPreview"

type Props = Readonly<{ trips: TripShape[] }>

function WorldMap({ trips }: Props) {
    const [width, setWidth] = useState(800)
    const [height, setHeight] = useState(600)
    const boxRef = useRef<Element>(null)
    const svgRef = useRef<SVGSVGElement>(null)

    const zoomToPointRef =
        useRef<(longitude: number, latitude: number) => void>()

    const pairs: [number, number][][] = []

    for (let i = 0; i < trips.length - 1; i++) {
        const pair: [number, number][] = [
            [trips[i].longitude, trips[i].latitude],
            [trips[i + 1].longitude, trips[i + 1].latitude],
        ]
        pairs.push(pair)
    }

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width: _width, height: _height } = entry.contentRect

                setWidth(_width)
                setHeight(_height)
            }
        })
        if (!boxRef.current) {
            return
        }
        resizeObserver.observe(boxRef.current)

        return () => {
            resizeObserver.disconnect()
        }
    }, [])

    const handleZoom = (e: { transform: d3.ZoomTransform }) => {
        d3.select("svg g").attr("transform", e.transform.toString())
        d3.selectAll("svg line")
            .attr("transform", e.transform.toString())
            .attr("stroke-width", 1.5 / e.transform.k)

        console.warn("transform", e.transform)
    }

    useEffect(() => {
        const zoom = d3
            .zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 10])
            .translateExtent([
                [0, 0],
                [width, height],
            ])
            .on("zoom", handleZoom)

        const projection = d3
            .geoMercator()
            .fitSize([width, height], mapData)
            .center([0, 5])

        const geoPathGenerator = d3.geoPath().projection(projection)

        const svg = d3.select("#map")
        // @ts-expect-error can't work out the types here :(
        svg.call(zoom)
        svg.selectChildren().remove()

        svg.append("g")
            .selectAll("path")
            .data(mapData.features.filter((shape) => shape.id !== "ATA"))
            .enter()
            .append("path")
            .attr("fill", "#000000")
            .attr("d", geoPathGenerator)
            .style("stroke", "#FFFFFF")

        for (const [c1, c2] of pairs) {
            svg.append("line")
                .attr("fill", "orange")
                .attr("stroke-width", 0.3)
                .attr("x1", projection(c1)?.[0] ?? 0)
                .attr("y1", projection(c1)?.[1] ?? 0)
                .attr("x2", projection(c2)?.[0] ?? 0)
                .attr("y2", projection(c2)?.[1] ?? 0)
                .style("stroke", "orange")
        }

        function transform(longitude: number, latitude: number) {
            return () => {
                const scale = 6
                const point = projection([longitude, latitude]) ?? [0, 0]
                return d3.zoomIdentity
                    .translate(
                        width / 2 - point[0] * scale,
                        height / 2 - point[1] * scale
                    )
                    .scale(scale)
            }
        }

        zoomToPointRef.current = (longitude: number, latitude: number) => {
            svg.transition()
                .duration(1000)
                // @ts-expect-error can't work out the types here :(
                .call(zoom.transform, transform(longitude, latitude))
        }
    }, [width, height, pairs])

    return (
        <Box
            sx={{ width: "100%", height: "100%", position: "relative" }}
            ref={boxRef}
        >
            <svg id="map" width={width} height={height} ref={svgRef} />

            <Box
                sx={{
                    position: "absolute",
                    height: "100%",
                    maxHeight: "100%",
                    overflow: "scroll",
                    top: 0,
                    left: 0,
                    width: "25%",
                    minWidth: "350px",
                    "& > *": {
                        margin: "15px",
                    },
                }}
            >
                {trips.map((trip) => (
                    <Box
                        key={trip._id}
                        onMouseEnter={() => {
                            if (!zoomToPointRef.current) {
                                return
                            }
                            zoomToPointRef.current(
                                trip.longitude,
                                trip.latitude
                            )
                        }}
                    >
                        <TripPreview
                            _id={trip._id}
                            images={trip.images}
                            name={trip.heading}
                            description={trip.description}
                            entryDate={new Date(trip.entryDate)}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default WorldMap
