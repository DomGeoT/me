import * as React from "react"

import NextImage from "next/image"
import { ImageProps } from "next/image"
import { Box, Skeleton } from "@mui/material"

export function Image(props: ImageProps) {
    const [loaded, setLoaded] = React.useState(false)
    const handleImageLoaded = React.useCallback(() => {
        setLoaded(true)
    }, [])

    return (
        <Box>
            <NextImage {...props} onLoad={handleImageLoaded} />
            {!loaded && (
                <>
                    <Box
                        sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            background: "#FFFFFF",
                        }}
                    />
                    <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            background: "rgb(0, 0, 0, 0.11)",
                        }}
                    />
                </>
            )}
        </Box>
    )
}
