"use client"
import React, { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Box } from "@mui/material"
import { mapData } from "./mapData"

type Props = Readonly<{ positions: { longitude: number; latitude: number }[] }>

function WorldMap({ positions }: Props) {
    const [width, setWidth] = useState(800)
    const [height, setHeight] = useState(600)
    const boxRef = useRef<Element>(null)
    const svgRef = useRef<SVGSVGElement>(null)

    const pairs: [number, number][][] = []

    for (let i = 0; i < positions.length - 1; i++) {
        const pair: [number, number][] = [
            [positions[i].longitude, positions[i].latitude],
            [positions[i + 1].longitude, positions[i + 1].latitude],
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

    const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 10])
        .on("zoom", handleZoom)

    useEffect(() => {
        const projection = d3
            .geoMercator()
            .fitSize([width, height], mapData)
            .center([0, 5])

        const geoPathGenerator = d3.geoPath().projection(projection)

        const svg = d3.select("#map")
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
    }, [width, height, pairs])

    return (
        <Box sx={{ width: "100%", height: "100%" }} ref={boxRef}>
            <svg id="map" width={width} height={height} ref={svgRef} />
        </Box>
    )
}

export default WorldMap
