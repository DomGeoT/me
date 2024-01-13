"use client"
import * as React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Menu from "@mui/icons-material/Menu"
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry"
import { Button } from "@mui/material"
import { HEADER_HEIGHT } from "@/constants/layout"
import { MenuModal } from "@/components/MenuModal"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isMenuModalOpen, setIsMenuModalOpen] = React.useState(false)
    const handleToggleMenuModal = React.useCallback(() => {
        setIsMenuModalOpen((state) => !state)
    }, [])

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
                            <Button onClick={handleToggleMenuModal}>
                                <Menu />
                            </Button>
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

                    <MenuModal
                        open={isMenuModalOpen}
                        onClose={handleToggleMenuModal}
                    />
                </ThemeRegistry>
            </body>
        </html>
    )
}
