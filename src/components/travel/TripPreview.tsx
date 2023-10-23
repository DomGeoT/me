import * as React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { Card, CardActionArea, CardContent, CardMedia } from "@mui/material"

type Props = Readonly<{
    _id: string
    name: string
    description: string
    images: string[]
    entryDate: Date
}>

export function TripPreview({
    _id,
    name,
    description,
    images,
    entryDate,
}: Props) {
    return (
        <Card>
            <CardActionArea href={`/travel/${_id}`}>
                {images && images[0] && (
                    <CardMedia component="img" height="200" image={images[0]} />
                )}
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h5">{name}</Typography>
                        <Typography
                            variant="caption"
                            sx={{ marginLeft: "auto" }}
                        >
                            {entryDate?.toLocaleDateString()}
                        </Typography>
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{ maxHeight: "100px", wordWrap: "break-word" }}
                    >
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
