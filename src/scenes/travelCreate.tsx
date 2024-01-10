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
import { useTheme } from "@mui/material/styles"
import Marked from "marked-react"

import { Close as CloseIcon } from "@mui/icons-material"

import { getPassword } from "@/utils"
import { useRouter } from "next/navigation"
import { Modal } from "@/components"

async function fileToBlob(file: File): Promise<Blob> {
    return new Promise((resolve) => {
        const reader = new FileReader()

        reader.onloadend = () => {
            const blob = new Blob([reader.result as ArrayBuffer])
            resolve(blob)
        }

        reader.readAsArrayBuffer(file)
    })
}

export function TravelCreate() {
    const router = useRouter()
    const theme = useTheme()

    const [heading, setHeading] = React.useState<string>("")
    const [description, setDescription] = React.useState<string>("")
    const [rawMarkdown, setRawMarkdown] = React.useState<string>("")
    const [longitude, setLongitude] = React.useState<number>()
    const [latitude, setLatitude] = React.useState<number>()
    const [images, setImages] = React.useState<Blob[]>([])

    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(false)

    const handleHeadingChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setHeading(event.target.value)
        },
        [setHeading]
    )
    const handleDescriptionChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.value.length > 200) {
                return
            }
            setDescription(event.target.value)
        },
        [setDescription]
    )
    const handleRawMarkdownChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setRawMarkdown(event.target.value)
        },
        [setRawMarkdown]
    )

    const handleCreateTrip = React.useCallback(async () => {
        setLoading(true)
        setError(false)
        if (!longitude || !latitude) {
            setLoading(false)
            setError(true)
            return
        }
        const body = {
            heading,
            description,
            rawMarkdownContent: rawMarkdown,
            longitude: `${longitude}`,
            latitude: `${latitude}`,
        }

        const data = new FormData()
        const imageData: [string, Blob][] = images.map((image) => [
            "image",
            image,
        ])

        for (const [key, value] of [...Object.entries(body), ...imageData]) {
            data.append(key, value)
        }

        const res = await fetch("/api/trips", {
            method: "POST",
            body: data,
            headers: {
                Authorization: getPassword(),
            },
        })
        setLoading(false)
        if (!res.ok) {
            setError(true)
            return
        }

        const { id } = (await res.json()) as { id: string }

        router.replace(`/travel/${id}`)
    }, [longitude, latitude, rawMarkdown, images, heading, description])

    const handleFileUploadChange = React.useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event?.target?.files?.[0]
            if (!file) {
                return
            }

            const blob = await fileToBlob(file)

            setImages((state) => {
                return [...state, blob]
            })
        },
        [setImages]
    )

    const handleDeleteImage = React.useCallback(
        (image: Blob) => {
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
        <Box
            sx={{
                margin: theme.spacing(2),
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography id="modal-modal-title" variant="h6" component="h2">
                New Trip
            </Typography>
            <Button sx={{ ml: "10px" }} onClick={handleTogglePasswordModal}>
                Security
            </Button>
            <FormControl>
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
                        <Marked>{rawMarkdown}</Marked>
                    </Box>
                </Box>

                <FormLabel>Images</FormLabel>
                <Box>
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
                                key={image.name}
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
                                    src={URL.createObjectURL(image)}
                                    onClick={() => handleDeleteImage(image)}
                                />
                            </Paper>
                        ))}
                    </Box>
                </Box>
            </FormControl>
            <Box>
                <Button onClick={handleCreateTrip} disabled={loading}>
                    Submit
                </Button>
            </Box>

            {error && (
                <Alert severity="warning">
                    An error occured saving the trip, please review the contents
                    and try again.
                </Alert>
            )}
            <Modal open={passwordModalOpen} onClose={handleTogglePasswordModal}>
                <>
                    <Typography variant="h4">Enter Password</Typography>
                    <TextField
                        sx={{ mt: theme.spacing(1) }}
                        onChange={handlePasswordFieldChange}
                        value={passwordValue}
                    ></TextField>
                </>
            </Modal>
        </Box>
    )
}
