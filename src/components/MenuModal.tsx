import * as React from "react"
import { Modal } from "./common"
import { InvertingText } from "./maximalism"
import { Box, Button } from "@mui/material"
import Cross from "@mui/icons-material/Close"
import { useRouter } from "next/navigation"

type Props = Readonly<{ open: boolean; onClose: () => void }>

export function MenuModal({ open, onClose }: Props) {
    const router = useRouter()

    const handleGoToAbout = React.useCallback(() => {
        router.push("/about")
        onClose()
    }, [router, onClose])

    const handleGoToTravel = React.useCallback(() => {
        router.push("/travel")
        onClose()
    }, [router, onClose])

    return (
        <Modal open={open} onClose={onClose} sx={{ maxWidth: "425px" }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Button onClick={handleGoToAbout}>
                    <InvertingText>About</InvertingText>
                </Button>
                <Button onClick={handleGoToTravel}>
                    <InvertingText>Travel</InvertingText>
                </Button>
                <Button onClick={onClose}>
                    <InvertingText>
                        <Cross sx={{ paddingTop: "8px" }} />
                    </InvertingText>
                </Button>
            </Box>
        </Modal>
    )
}
