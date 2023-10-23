import {
    Alert,
    Box,
    Button,
    FormControl,
    FormLabel,
    Paper,
    TextField,
    Typography,
} from "@mui/material"
import * as React from "react"
import { Modal } from "../common"
import Marked from "marked-react"

import { Close as CloseIcon } from "@mui/icons-material"

import { PostTripRequest } from "@/types/api/trips"

type Props = Readonly<{ open: boolean; onClose: () => void }>

export function NewTripModal({ open, onClose }: Props) {
    const [heading, setHeading] = React.useState<string>("")
    const [description, setDescription] = React.useState<string>("")
    const [rawMarkdown, setRawMarkdown] = React.useState<string>("")
    const [rawMarkdownWithHeading, setRawMarkdownWithHeading] =
        React.useState<string>("")
    const [longitude, setLongitude] = React.useState<number>()
    const [latitude, setLatitude] = React.useState<number>()
    const [images, setImages] = React.useState<string[]>([])

    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(false)

    const handleHeadingChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setHeading(event.target.value)
        },
        []
    )
    const handleDescriptionChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.value.length > 200) {
                return
            }
            setDescription(event.target.value)
        },
        []
    )
    const handleRawMarkdownChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setRawMarkdown(event.target.value)
        },
        []
    )

    React.useEffect(
        () =>
            setRawMarkdownWithHeading(
                (heading ? `# ${heading}\n\n` : "") + rawMarkdown
            ),
        [heading, rawMarkdown]
    )

    const handleCreateTrip = React.useCallback(async () => {
        setLoading(true)
        setError(false)
        if (!longitude || !latitude) {
            setLoading(false)
            setError(true)
            return
        }
        const body: PostTripRequest = {
            heading,
            description,
            rawMarkdownContent: rawMarkdownWithHeading,
            images,
            longitude,
            latitude,
        }

        const res = await fetch("/api/trips", {
            method: "POST",
            body: JSON.stringify(body),
        })
        setLoading(false)
        if (!res.ok) {
            setError(true)
            return
        }
        onClose()
    }, [
        longitude,
        latitude,
        rawMarkdown,
        images,
        heading,
        description,
        rawMarkdownWithHeading,
    ])

    const handleFileUploadChange = React.useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event?.target?.files?.[0]
            if (!file) {
                return
            }

            // Create an HTMLImageElement to load the uploaded image
            const image = new Image()
            image.src = URL.createObjectURL(file)

            // When the image has loaded, convert it to WebP format
            image.onload = () => {
                const canvas = document.createElement("canvas")
                canvas.width = image.width
                canvas.height = image.height

                const ctx = canvas.getContext("2d")
                if (ctx) {
                    ctx.drawImage(image, 0, 0, image.width, image.height)

                    // Convert the image to WebP format with quality (0.8 is a good value, adjust as needed)
                    canvas.toBlob(
                        (webpBlob) => {
                            if (!webpBlob) {
                                return
                            }
                            const reader = new FileReader()
                            reader.onload = (e) => {
                                const base64String = e.target?.result
                                if (
                                    !base64String ||
                                    typeof base64String !== "string"
                                ) {
                                    return
                                }
                                setImages((state) => {
                                    if (state.includes(base64String)) {
                                        return state
                                    }
                                    return [...state, base64String]
                                })
                            }
                            reader.readAsDataURL(webpBlob)
                        },
                        "image/webp",
                        0.8
                    )
                }
            }
        },
        [setImages]
    )

    const handleDeleteImage = React.useCallback(
        (image: string) => {
            if (loading) {
                return
            }
            setImages((state) => {
                return state.filter((i) => i !== image)
            })
        },
        [setImages]
    )

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
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    New Trip
                </Typography>
                <FormControl sx={{ flex: 1, overflowY: "auto" }}>
                    <FormLabel>Heading</FormLabel>
                    <TextField
                        sx={{ width: "100%" }}
                        value={heading}
                        onChange={handleHeadingChange}
                        disabled={loading}
                    />

                    <FormLabel>Description</FormLabel>
                    <TextField
                        sx={{ width: "100%" }}
                        value={description}
                        onChange={handleDescriptionChange}
                        disabled={loading}
                    />

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
                            <FormLabel>Entry</FormLabel>
                            <TextField
                                sx={{ width: "100%" }}
                                multiline
                                value={rawMarkdown}
                                onChange={handleRawMarkdownChange}
                                disabled={loading}
                            />
                        </Box>
                        <Box sx={{ flex: "1" }}>
                            <FormLabel>Preview</FormLabel>
                            <Marked>{rawMarkdownWithHeading}</Marked>
                        </Box>
                    </Box>

                    <FormLabel>Images</FormLabel>
                    <Box sx={{}}>
                        <label htmlFor="fileInput"></label>

                        <input
                            id="contained-button-file"
                            type="file"
                            onChange={handleFileUploadChange}
                            accept="images/*"
                            disabled={loading}
                            hidden
                        />

                        <label htmlFor="contained-button-file">
                            <Button component="span">Add image</Button>
                        </label>

                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                width: "100%",
                                minHeight: "200px",
                                "& > *": {
                                    margin: "2px",
                                },
                                margin: "4px",
                            }}
                        >
                            {images.map((image) => (
                                <Paper
                                    key={image}
                                    sx={{
                                        padding: "2px",
                                        position: "relative",
                                        width: "200px",
                                        overflow: "hidden", // Add this to hide the part of the image that exceeds 200px in width
                                        "&:hover .close-icon": {
                                            visibility: "visible", // Show the CloseIcon when Paper is hovered
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: "50%", // Position close icon in the vertical center
                                            left: "50%", // Position close icon in the horizontal center
                                            transform: "translate(-50%, -50%)", // Center the close icon
                                            zIndex: 1, // Ensure the close icon is above the image
                                            "& > *": {
                                                visibility: "hidden",
                                            },
                                        }}
                                    >
                                        <CloseIcon
                                            className="close-icon"
                                            sx={{ fontSize: "80px" }}
                                        />
                                    </Box>

                                    <img
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "auto", // Maintain the aspect ratio
                                            transition: "transform 0.2s", // Add a transition for smooth hover effect
                                        }}
                                        src={image}
                                        onClick={() => handleDeleteImage(image)}
                                    />
                                </Paper>
                            ))}
                        </Box>
                    </Box>
                </FormControl>
            </Box>
            <Button onClick={handleCreateTrip} disabled={loading}>
                Submit
            </Button>
            {error && (
                <Alert severity="warning">
                    An error occured saving the trip, please review the contents
                    and try again.
                </Alert>
            )}
        </Modal>
    )
}
