"use client"

import React, { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Box } from "@mui/material"
import { mapData } from "./mapData"

function WorldMap() {
    const [svgPaths, setSvgPaths] = React.useState<React.ReactNode[]>([])
    const [width, setWidth] = useState(800)
    const [height, setHeight] = useState(600)
    const boxRef = useRef(null)

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width: _width, height: _height } = entry.contentRect

                setWidth(_width)
                setHeight(_height)
            }
        })
        resizeObserver.observe(boxRef.current)

        return () => {
            resizeObserver.disconnect()
        }
    }, [])

    useEffect(() => {
        const projection = d3.geoMercator().fitSize([width, height], mapData)

        const geoPathGenerator = d3.geoPath().projection(projection)

        const allSvgPaths = mapData.features
            .filter((shape) => shape.id !== "ATA")
            .map((shape) => {
                return (
                    <path
                        key={shape.id}
                        d={geoPathGenerator(shape)}
                        stroke="white"
                        strokeWidth={0.5}
                        fill="black"
                        fillOpacity={0.9}
                    />
                )
            })

        setSvgPaths(allSvgPaths)
    }, [width, height])

    return (
        <Box sx={{ width: "100%", height: "100%" }} ref={boxRef}>
            <svg width={width} height={height}>
                {svgPaths}
            </svg>
        </Box>
    )
}

export default WorldMap
