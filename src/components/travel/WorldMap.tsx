"use client"
import React, { useCallback, useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Box, useMediaQuery } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { mapData } from "./mapData"
import { TripShape } from "@/types/collections/trips"
import { TripPreview } from "./TripPreview"

type Props = Readonly<{ trips: TripShape[] }>

function WorldMap({ trips }: Props) {
    const theme = useTheme()
    const smallScreen = useMediaQuery(theme.breakpoints.down("sm"))
    const [width, setWidth] = useState(800)
    const [height, setHeight] = useState(600)
    const boxRef = useRef<Element>(null)
    const svgRef = useRef<SVGSVGElement>(null)

    const borderWidth = smallScreen ? 1 : 3

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
        d3.selectAll("svg path").attr(
            "stroke-width",
            Math.min(4 / e.transform.k, borderWidth)
        )
        d3.selectAll("svg line")
            .attr("transform", e.transform.toString())
            .attr("stroke-width", 1.5 / e.transform.k)
        d3.selectAll("svg circle")
            .attr("transform", e.transform.toString())
            .attr("stroke-width", 0.01 / e.transform.k)
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
            .attr("fill", theme.palette.primary.dark)
            .attr("d", geoPathGenerator)
            .style("stroke", theme.palette.background.default)
            .attr("stroke-width", borderWidth)
            .style("paint-order", "stroke")

        for (const [c1, c2] of pairs) {
            svg.append("line")
                .attr("fill", theme.palette.primary.main)
                .attr("stroke-width", 0.3)
                .attr("x1", projection(c1)?.[0] ?? 0)
                .attr("y1", projection(c1)?.[1] ?? 0)
                .attr("x2", projection(c2)?.[0] ?? 0)
                .attr("y2", projection(c2)?.[1] ?? 0)
                .style("stroke", theme.palette.primary.main)
        }

        for (const { longitude, latitude } of trips) {
            svg.append("circle")
                .attr("fill", "grey") // Set the fill color to grey
                .attr("r", 0.3) // Set the radius of the circle (adjust as needed)
                .attr("cx", projection([longitude, latitude])?.[0] ?? 0) // Compute x position using projection
                .attr("cy", projection([longitude, latitude])?.[1] ?? 0) // Compute y position using projection
        }

        function transform(longitude: number, latitude: number) {
            return () => {
                const scale = 10
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

    const handleCardInteraction = useCallback((trip: TripShape) => {
        if (!zoomToPointRef.current) {
            return
        }
        zoomToPointRef.current(trip.longitude, trip.latitude)
    }, [])

    return (
        <Box
            sx={{ width: "100%", height: "100%", position: "relative" }}
            ref={boxRef}
        >
            <svg
                id="map"
                width={width}
                height={smallScreen ? height - 100 : height}
                ref={svgRef}
                style={{ position: "absolute", top: 0, left: 0 }}
            />

            <Box
                sx={{
                    position: "absolute",
                    display: "flex",
                    height: "100%",
                    maxHeight: smallScreen ? "200px" : "100%",
                    overflow: "scroll",
                    top: smallScreen ? undefined : "0",
                    bottom: smallScreen ? 0 : undefined,
                    left: 0,
                    width: smallScreen ? "100%" : "25%",
                    minWidth: smallScreen ? undefined : "350px",
                    maxWidth: "100%",
                    marginTop: theme.spacing(1.5),
                    "& > *": {
                        marginBottom: smallScreen
                            ? undefined
                            : theme.spacing(1.5),
                        marginX: theme.spacing(1.5),
                    },
                    flexDirection: smallScreen ? "row" : "column",
                }}
            >
                {trips.map((trip) => (
                    <Box
                        key={trip._id}
                        onMouseEnter={() => handleCardInteraction(trip)}
                        onTouchStart={() => handleCardInteraction(trip)}
                        sx={{
                            "& > *": {
                                width: smallScreen ? "200px" : undefined,
                                height: smallScreen ? "200px" : undefined,
                            },
                        }}
                    >
                        <TripPreview
                            _id={trip._id}
                            images={trip.images}
                            name={trip.heading}
                            description={trip.description}
                            entryDate={new Date(trip.entryDate)}
                            smallMode={smallScreen}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default WorldMap
