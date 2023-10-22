import {
    Box,
    Button,
    FormControl,
    FormLabel,
    IconButton,
    TextField,
    Typography,
} from "@mui/material"
import * as React from "react"
import { Modal } from "../common"
import Marked from "marked-react"

import { FmdGood } from "@mui/icons-material"
import { PostTripRequest } from "@/app/types/api/trips"

type Props = Readonly<{ open: boolean; onClose: () => void }>

export function NewTripModal({ open, onClose }: Props) {
    const [rawMarkdown, setRawMarkdown] = React.useState<string>("")
    const [longitude, setLongitude] = React.useState<number>()
    const [latitude, setLatitude] = React.useState<number>()

    const handleRawMarkdownChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setRawMarkdown(event.target.value)
        },
        []
    )

    const handleCreateTrip = React.useCallback(async () => {
        if (!longitude || !latitude) {
            return
        }
        const body: PostTripRequest = {
            heading: rawMarkdown.split("\n", 1)[0].replaceAll("#", "").trim(),
            rawMarkdownContent: rawMarkdown,
            longitude,
            latitude,
        }

        const res = await fetch("/api/trips", {
            method: "POST",
            body: JSON.stringify(body),
        })
        if (!res.ok) {
            return
        }
        onClose()
    }, [longitude, latitude, rawMarkdown])

    React.useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => {
                const { longitude: _longitude, latitude: _latitude } =
                    position.coords
                setLongitude(_longitude)
                setLatitude(_latitude)
            }
        )
    }, [])

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "60vh",
                }}
            >
                {" "}
                {/* Set maxHeight for dynamic sizing */}
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    New Trip
                </Typography>
                <FormControl sx={{ flex: 1, overflowY: "auto" }}>
                    {" "}
                    {/* Use overflowY: 'auto' to enable scrolling when needed */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            "& > *": {
                                pb: "4px",
                            },
                        }}
                    >
                        <Box sx={{ flex: "1", pr: 4 }}>
                            <FormLabel>Title</FormLabel>
                            <TextField
                                sx={{ width: "100%" }}
                                multiline
                                value={rawMarkdown}
                                onChange={handleRawMarkdownChange}
                            />
                        </Box>
                        <Box sx={{ flex: "1" }}>
                            <FormLabel>Preview</FormLabel>
                            <Marked>{rawMarkdown}</Marked>
                        </Box>
                    </Box>
                    <FormLabel>Location</FormLabel>
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            "& > *": {
                                mr: "4px",
                            },
                            alignItems: "center",
                        }}
                    >
                        <TextField value={longitude} disabled />
                        <TextField value={latitude} disabled />
                        <IconButton
                            href={`https://www.google.com/maps/@${longitude},${latitude}`}
                            target="_blank"
                        >
                            <FmdGood />
                        </IconButton>
                    </Box>
                </FormControl>
            </Box>
            <Button onClick={handleCreateTrip}>Submit</Button>
        </Modal>
    )
}
