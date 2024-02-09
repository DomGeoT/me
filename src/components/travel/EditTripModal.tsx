import {
    Alert,
    Box,
    Button,
    FormControl,
    FormLabel,
    TextField,
    Typography,
} from "@mui/material"
import * as React from "react"
import { Modal } from "../common"
import Marked from "marked-react"

import { PatchTripRequest } from "@/types/api/trips"
import { getPassword } from "@/utils"

type Props = Readonly<{
    open: boolean
    onClose: () => void
    values: {
        tripId: string
        heading?: string
        description?: string
        rawMarkdown?: string
    }
}>

export function EditTripModal({ open, onClose, values }: Props) {
    const [heading, setHeading] = React.useState<string>(values.heading ?? "")
    const [description, setDescription] = React.useState<string>(
        values.description ?? ""
    )
    const [rawMarkdown, setRawMarkdown] = React.useState<string>(
        values.rawMarkdown ?? ""
    )

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

    const handleUpdateTrip = React.useCallback(async () => {
        setLoading(true)
        setError(false)

        const body: PatchTripRequest = {
            heading,
            description,
            rawMarkdownContent: rawMarkdown,
        }

        const res = await fetch(`/api/trips/${values.tripId}`, {
            method: "PATCH",
            body: JSON.stringify(body),
            headers: {
                Authorization: getPassword(),
            },
        })
        setLoading(false)
        if (!res.ok) {
            setError(true)
            return
        }
        onClose()
    }, [rawMarkdown, heading, description])

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
                            <Marked>{rawMarkdown}</Marked>
                        </Box>
                    </Box>
                </FormControl>
            </Box>
            <Button onClick={handleUpdateTrip} disabled={loading}>
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
