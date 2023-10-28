"use client"
import * as React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import PersonIcon from "@mui/icons-material/Person"
import FlightIcon from "@mui/icons-material/Flight"
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry"
import { Link, useMediaQuery } from "@mui/material"
import { HEADER_HEIGHT } from "@/constants/layout"
import { useTheme } from "@mui/material/styles"

const LINKS = [
    { text: "ABOUT", href: "/about", icon: <PersonIcon /> },
    { text: "TRAVEL", href: "/travel", icon: <FlightIcon /> },
]

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const theme = useTheme()
    const smallScreen = useMediaQuery(theme.breakpoints.down("sm"))

    return (
        <html lang="en">
            <body>
                <title>Dom Taylor</title>
                <ThemeRegistry>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100vw",
                            height: `calc(${HEADER_HEIGHT}px - 10px)`,
                            padding: "10px",
                            alignItems: "center",
                            backgroundColor: "background.default",
                            borderColor: "background.paper",
                            position: "fixed",
                            top: "0",
                            left: "0",
                            zIndex: 2000,
                        }}
                    >
                        <Typography
                            variant="h4"
                            noWrap
                            component="div"
                            color="black"
                            sx={{
                                position: "absolute",
                                left: "50%",
                                margin: "5px",
                                transform: "translate(-50%)",
                                backgroundColor: "black",
                                color: "white",
                                paddingX: "10px",
                            }}
                        >
                            DOM TAYLOR
                        </Typography>

                        <Box
                            sx={{
                                position: "absolute",
                                display: "flex",
                                flexDirection: "row",
                                right: "10px",
                            }}
                        >
                            {LINKS.map((link) => {
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        sx={{
                                            position: "relative",
                                            marginX: "10px",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            textDecoration: "none",
                                            paddingX: "12px",
                                            ":hover": {
                                                "& > div": {
                                                    width: "0%", // Squish the background to the left on hover
                                                },
                                            },
                                        }}
                                    >
                                        <>
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    width: "100%",
                                                    height: "100%",
                                                    backgroundColor: "black",
                                                    transition:
                                                        "width 0.3s ease-in-out", // Add a transition for smooth animation
                                                }}
                                            ></Box>
                                            {smallScreen && link.icon}
                                            {!smallScreen && (
                                                <Typography
                                                    sx={{
                                                        paddingLeft: "3px",
                                                        backgroundColor:
                                                            "transparent",
                                                    }}
                                                    variant="h6"
                                                    noWrap
                                                    component="div"
                                                >
                                                    {link.text}
                                                </Typography>
                                            )}
                                        </>
                                    </Link>
                                )
                            })}
                        </Box>
                    </Box>

                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            bgcolor: "background.default",
                            mt: ["48px", "56px", "64px"],
                            p: 3,
                            height: `calc(100vh - ${HEADER_HEIGHT} - 6)`,
                            position: "relative",
                        }}
                    >
                        {children}
                    </Box>
                </ThemeRegistry>
            </body>
        </html>
    )
}
