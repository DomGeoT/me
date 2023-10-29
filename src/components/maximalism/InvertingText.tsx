"use client"
import * as React from "react"
import Typography from "@mui/material/Typography"
import { Box } from "@mui/material"

import { styled } from "@mui/material/styles"

const InvertingBox = styled(Box)(() => ({
    display: "flex",
    width: "100%",
    height: "100%",
    position: "relative",
}))

const TextWrapper1 = styled(Box)(() => ({
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
}))

const TextWrapper2 = styled(Box)(() => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    "&:hover": {
        "& > *": {
            width: "100%",
        },
    },
}))

type Props = Readonly<{
    children: React.ReactNode
    variant?: "h4" | "h5" | "h6"
}>

export function InvertingText({ children, variant = "h5" }: Props) {
    return (
        <InvertingBox>
            <TextWrapper1>
                <Typography
                    variant={variant}
                    sx={{
                        width: "100%",
                        backgroundColor: "white",
                        color: "black",
                        paddingLeft: "0px",
                        paddingRight: "0px",
                    }}
                    noWrap
                    textOverflow="clip"
                >
                    {children}
                </Typography>
            </TextWrapper1>
            <TextWrapper2>
                <Typography
                    component="div"
                    sx={{
                        width: "0%",
                        backgroundColor: "black",
                        color: "white",
                        transition: "width 0.3s",
                        paddingLeft: "0px",
                        paddingRight: "0px",
                    }}
                    variant={variant}
                    noWrap
                    textOverflow="clip"
                >
                    {children}
                </Typography>
            </TextWrapper2>
        </InvertingBox>
    )
}
