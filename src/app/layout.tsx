import * as React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import PersonIcon from "@mui/icons-material/Person"
import FlightIcon from "@mui/icons-material/Flight"
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry"
import { Link } from "@mui/material"
import { HEADER_HEIGHT } from "@/constants/layout"

export const metadata = {
    title: "Next.js App Router + Material UI v5",
    description: "Next.js App Router + Material UI v5",
}

const LINKS = [
    { text: "About", href: "/about", icon: <PersonIcon /> },
    { text: "Travel", href: "/travel", icon: <FlightIcon /> },
]

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
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
                            height: `calc(${HEADER_HEIGHT} - 10)`,
                            padding: "10px",
                            alignItems: "center",
                            borderBottom: "2px solid",
                            backgroundColor: "background.default",
                            borderColor: "background.paper",
                            position: "fixed",
                            top: "0",
                            left: "0",
                            zIndex: 2000,
                            "& > *": {
                                marginRight: "30px",
                            },
                        }}
                    >
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            color="black"
                            sx={{ marginLeft: "20px" }}
                        >
                            Dom Taylor
                        </Typography>

                        {LINKS.map((link) => {
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    sx={{
                                        marginX: "10px",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        textDecoration: "none",
                                    }}
                                >
                                    <>
                                        {link.icon}
                                        <Typography
                                            sx={{ paddingLeft: "3px" }}
                                            variant="h6"
                                            noWrap
                                            component="div"
                                        >
                                            {link.text}
                                        </Typography>
                                    </>
                                </Link>
                            )
                        })}
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
