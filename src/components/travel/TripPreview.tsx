import * as React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Skeleton,
} from "@mui/material"
import { useTheme, styled } from "@mui/material/styles"

type Props = Readonly<{
    _id: string
    name: string
    description: string
    images: string[]
    entryDate: Date
}>

const PaddedSkeleton = styled(Skeleton)`
    margin: 2px;
`

export function TripPreviewSkeleton() {
    const theme = useTheme()
    return (
        <Card sx={{ borderRadius: "0px", border: "1px solid" }}>
            <CardActionArea
                sx={{ height: "100%", paddingBottom: theme.spacing(2) }}
            >
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{ height: "200px" }}
                />
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{ textTransform: "uppercase", width: "50px" }}
                        >
                            <PaddedSkeleton
                                animation="wave"
                                variant="rectangular"
                            />
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ marginLeft: "auto", width: "40px" }}
                        >
                            <PaddedSkeleton
                                animation="wave"
                                variant="rectangular"
                            />
                        </Typography>
                    </Box>

                    <Typography
                        variant="body1"
                        sx={{ maxHeight: "100px", wordWrap: "break-word" }}
                    >
                        <PaddedSkeleton
                            animation="wave"
                            variant="rectangular"
                        />
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export function TripPreview({
    _id,
    name,
    description,
    images,
    entryDate,
}: Props) {
    const theme = useTheme()
    return (
        <Card sx={{ borderRadius: "0px", border: "1px solid" }}>
            <CardActionArea
                href={`/travel/${_id}`}
                sx={{ height: "100%", paddingBottom: theme.spacing(2) }}
            >
                {images && images[0] && (
                    <CardMedia component="img" height="200" image={images[0]} />
                )}
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{ textTransform: "uppercase" }}
                        >
                            {name}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                alignSelf: "flex-start",
                                marginLeft: "auto",
                                marginTop: "6px",
                            }}
                        >
                            {entryDate?.toLocaleDateString()}
                        </Typography>
                    </Box>

                    <Typography
                        variant="body1"
                        sx={{ maxHeight: "100px", wordWrap: "break-word" }}
                    >
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
