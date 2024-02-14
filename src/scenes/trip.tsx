"use client"
import * as React from "react"
import { GetTripResponse } from "../types/api/trips"
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    Link,
    Typography,
    useMediaQuery,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { useRouter } from "next/navigation"
import Marked from "marked-react"
import { HEADER_HEIGHT } from "@/constants/layout"
import { InvertingText } from "@/components/maximalism"
import { getPassword } from "@/utils"
import { ArrowLeft, ArrowRight } from "@mui/icons-material"
import { EditTripModal } from "@/components"

type Props = Readonly<{ tripId: string }>

export default function Travel({ tripId }: Props) {
    const theme = useTheme()
    const smallScreen = useMediaQuery(theme.breakpoints.down("sm"))
    const router = useRouter()
    const [trip, setTrip] = React.useState<GetTripResponse["trip"]>()
    const [showEditTripModal, setShowEditTripModal] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [hideLabels, setHideLables] = React.useState(false)
    const [currentImage, setCurrentImage] = React.useState(0)

    const [password, setPassword] = React.useState<string>()

    React.useEffect(() => {
        setPassword(getPassword())
    }, [])

    const handleToggleEditTripModal = React.useCallback(() => {
        setShowEditTripModal((state) => !state)
    }, [])

    const handleClickLeftImageArrow = React.useCallback(
        () =>
            setCurrentImage((state) => {
                if (!trip) {
                    return 0
                }
                if (state === 0) {
                    return trip.images.length - 1
                }
                return state - 1
            }),
        [trip]
    )
    const handleClickRightImageArrow = React.useCallback(
        () =>
            setCurrentImage((state) => {
                if (!trip) {
                    return 0
                }
                if (state === trip.images.length - 1) {
                    return 0
                }
                return state + 1
            }),
        [trip]
    )

    React.useEffect(() => {
        async function f() {
            setLoading(true)
            const res = await fetch(`/api/trips/${tripId}`, {
                method: "GET",
            })
            if (!res.ok) {
                setLoading(false)
                return
            }
            const body = (await res.json()) as GetTripResponse
            setTrip({ ...body.trip, entryDate: new Date(body.trip.entryDate) })
            setLoading(false)
        }
        void f()
    }, [])

    const handleToggleHideLabels = React.useCallback(
        () => setHideLables((state) => !state),
        []
    )

    const handleDeleteTrip = React.useCallback(async () => {
        setLoading(true)
        const res = await fetch(`/api/trips/${tripId}`, {
            method: "DELETE",
            headers: {
                Authorization: password ?? "",
            },
        })
        if (!res.ok) {
            setLoading(false)
            return
        }
        router.back()
    }, [password])

    if (loading) {
        return (
            <CircularProgress
                sx={{
                    position: "fixed",
                    top: "50%",
                    right: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            />
        )
    }
    if (!trip) {
        return <Typography>Sorry we could not find the trip...</Typography>
    }

    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            {trip.images?.length > 0 && (
                <Box sx={{ position: "relative", width: "100%" }}>
                    <img
                        style={{
                            width: "100%",
                            height: "100%",
                            maxHeight: `calc(95vh - ${HEADER_HEIGHT}px)`,
                            objectFit: hideLabels ? "contain" : "cover",
                        }}
                        src={trip.images[currentImage]}
                        onClick={handleToggleHideLabels}
                    />
                    <Typography
                        variant={smallScreen ? "h4" : "h2"}
                        sx={{
                            position: "absolute",
                            top: theme.spacing(2),
                            left: hideLabels ? "-100vw" : theme.spacing(2),
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            overflow: "clip",
                            textOverflow: "clip",
                            transition: "left 0.3s ease-in-out",
                        }}
                    >
                        {trip.heading}
                    </Typography>

                    <Typography
                        variant={"body1"}
                        sx={{
                            position: "absolute",
                            bottom: theme.spacing(2),
                            right: theme.spacing(2),
                            padding: "10px",
                            backgroundColor: "background.paper",
                            maxWidth: "100%",

                            left: hideLabels ? "-100vw" : theme.spacing(2),
                            textOverflow: "clip",
                            transition: "left 0.3s ease-in-out",
                        }}
                    >
                        {trip.description}
                    </Typography>

                    {trip.images.length > 1 && (
                        <IconButton
                            onClick={handleClickLeftImageArrow}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: theme.spacing(4),
                                transform: "translate(0%, -50%)",
                                padding: "1px",
                                backgroundColor: theme.palette.background.paper,
                            }}
                        >
                            <ArrowLeft />
                        </IconButton>
                    )}

                    {trip.images.length > 1 && (
                        <IconButton
                            onClick={handleClickRightImageArrow}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                right: theme.spacing(4),
                                transform: "translate(0%, -50%)",
                                padding: "1px",
                                backgroundColor: theme.palette.background.paper,
                            }}
                        >
                            <ArrowRight />
                        </IconButton>
                    )}
                </Box>
            )}

            <Box
                sx={{
                    margin: theme.spacing(2),
                    maxWidth: smallScreen ? undefined : "800px",
                    minWidth: "60vw",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: smallScreen ? "column" : "row",
                    }}
                >
                    <Link
                        href={`https://www.google.com/maps/@${trip.latitude},${trip.longitude},13z`}
                        target="_blank"
                        sx={{ textDecoration: "none" }}
                    >
                        <InvertingText variant="h6">
                            Location: {Number(trip.longitude).toFixed(2)},{" "}
                            {Number(trip.latitude).toFixed(2)}
                        </InvertingText>
                    </Link>
                    {password && (
                        <>
                            <Button
                                onClick={handleToggleEditTripModal}
                                sx={{
                                    marginTop: smallScreen
                                        ? theme.spacing(1)
                                        : "auto",
                                    marginLeft: smallScreen
                                        ? undefined
                                        : "auto",
                                }}
                                variant="contained"
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={handleDeleteTrip}
                                sx={{
                                    marginTop: smallScreen
                                        ? theme.spacing(1)
                                        : "auto",
                                    marginLeft: smallScreen
                                        ? undefined
                                        : "auto",
                                }}
                                variant="contained"
                            >
                                Delete
                            </Button>
                        </>
                    )}
                </Box>

                <Marked>{trip.rawMarkdownContent}</Marked>
            </Box>
            <EditTripModal
                open={showEditTripModal}
                onClose={handleToggleEditTripModal}
                values={{
                    tripId,
                    heading: trip.heading,
                    description: trip.description,
                    rawMarkdown: trip.rawMarkdownContent,
                }}
            ></EditTripModal>
        </Box>
    )
}
