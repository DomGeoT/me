"use client"
import * as React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import PersonIcon from "@mui/icons-material/Person"
import FlightIcon from "@mui/icons-material/Flight"
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry"
import { Button, Link, TextField, useMediaQuery } from "@mui/material"
import { HEADER_HEIGHT } from "@/constants/layout"
import { useTheme } from "@mui/material/styles"
import { InvertingText } from "@/components/maximalism"
import { Modal } from "@/components"
import { getPassword } from "@/utils"

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

    const [passwordModalOpen, setPasswordModalOpen] = React.useState(false)
    const handleTogglePasswordModal = React.useCallback(
        () => setPasswordModalOpen((state) => !state),
        []
    )

    const [passwordValue, setPasswordValue] = React.useState(getPassword())
    const handlePasswordFieldChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            localStorage.setItem("password", event.target.value)
            setPasswordValue(event.target.value)
        },
        []
    )

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
                            alignItems: "center",
                            backgroundColor: "background.default",
                            borderColor: "background.paper",
                            position: "fixed",
                            top: "0",
                            left: "0",
                            zIndex: 2000,
                        }}
                    >
                        <Button
                            sx={{ ml: "10px" }}
                            onClick={handleTogglePasswordModal}
                        >
                            Security
                        </Button>

                        <Typography
                            variant="h4"
                            noWrap
                            component="div"
                            sx={{
                                position: "absolute",
                                left: "50%",
                                margin: "5px",
                                transform: "translate(-50%)",
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
                                        sx={{
                                            textDecoration: "none",
                                            marginX: theme.spacing(1),
                                        }}
                                        key={link.href}
                                        href={link.href}
                                    >
                                        <>
                                            {smallScreen && link.icon}
                                            {!smallScreen && (
                                                <InvertingText>
                                                    {link.text}
                                                </InvertingText>
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
                            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
                            position: "relative",
                        }}
                    >
                        {children}
                    </Box>

                    <Modal
                        open={passwordModalOpen}
                        onClose={handleTogglePasswordModal}
                    >
                        <>
                            <Typography variant="h4">Enter Password</Typography>
                            <TextField
                                sx={{ mt: theme.spacing(1) }}
                                onChange={handlePasswordFieldChange}
                                value={passwordValue}
                            ></TextField>
                        </>
                    </Modal>
                </ThemeRegistry>
            </body>
        </html>
    )
}
