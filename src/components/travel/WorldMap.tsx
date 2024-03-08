"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Box } from "@mui/material"
import { mapData } from "./mapData"
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom"

type Props = Readonly<{ positions: { longitude: number; latitude: number }[] }>

function WorldMap({ positions }: Props) {
    const [svgPaths, setSvgPaths] = React.useState<React.ReactNode[]>([])
    const [width, setWidth] = useState(800)
    const [height, setHeight] = useState(600)
    const boxRef = useRef<Element>(null)
    const svgRef = useRef<SVGSVGElement>(null)

    const pairs: [number, number][][] = []

    // Iterate through the positions array to create pairs
    for (let i = 0; i < positions.length - 1; i++) {
        // Create a pair of consecutive coordinates
        const pair: [number, number][] = [
            [positions[i].longitude, positions[i].latitude],
            [positions[i + 1].longitude, positions[i + 1].latitude],
        ]
        // Push the pair to the pairs array
        pairs.push(pair)
    }

    const onUpdate = useCallback(
        ({ x, y, scale }: { x: number; y: number; scale: number }) => {
            // check if image exists
            if (svgRef.current) {
                const value = make3dTransformValue({ x, y, scale })
                svgRef.current.style.setProperty("transform", value)
            }
        },
        []
    )

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

    useEffect(() => {
        const projection = d3
            .geoMercator()
            .fitSize([width, height], mapData as d3.ExtendedFeatureCollection)

        const geoPathGenerator = d3.geoPath().projection(projection)

        const mapPaths = mapData.features
            .filter((shape) => shape.id !== "ATA")
            .map((shape) => {
                return (
                    <path
                        key={shape.id}
                        d={geoPathGenerator(shape) ?? undefined}
                        stroke="white"
                        strokeWidth={0.5}
                        fill="black"
                        fillOpacity={0.9}
                    />
                )
            })

        const linkPaths = pairs.map((a) => {
            return (
                <path
                    key={"p"}
                    d={
                        geoPathGenerator({
                            type: "LineString",
                            coordinates: [a[0], a[1]],
                        }) ?? undefined
                    }
                    stroke="orange"
                    strokeWidth={0.2}
                    fill="orange"
                    fillOpacity={0.9}
                />
            )
        })

        setSvgPaths([...mapPaths, ...linkPaths])
    }, [width, height, positions])

    return (
        <Box sx={{ width: "100%", height: "100%" }} ref={boxRef}>
            <QuickPinchZoom
                onUpdate={onUpdate}
                tapZoomFactor={2}
                zoomOutFactor={4}
                inertiaFriction={0}
                maxZoom={10}
                minZoom={1}
            >
                <svg width={width} height={height} ref={svgRef}>
                    {svgPaths}
                </svg>
            </QuickPinchZoom>
        </Box>
    )
}

export default WorldMap
