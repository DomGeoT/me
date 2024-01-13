"use client"
import * as React from "react"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import { About } from "@/scenes"

export default function AboutPage() {
    return (
        <Container>
            <title>Dom Taylor | About</title>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <About />
            </Box>
        </Container>
    )
}
