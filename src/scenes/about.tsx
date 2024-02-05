import { Box, Typography, useMediaQuery } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import * as React from "react"

type ImageTextProps = Readonly<{
    image: string
    text: string
    reverse: boolean
}>

function ImageText({ image, text, reverse }: ImageTextProps) {
    const theme = useTheme()
    const smallScreen = useMediaQuery(theme.breakpoints.down("md"))

    const smallScreenFlow = "column-reverse"
    const regularFlow = reverse ? "row" : "row-reverse"

    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                height: "100%",
                gap: theme.spacing(2),
                flexDirection: smallScreen ? smallScreenFlow : regularFlow,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: smallScreen
                    ? theme.spacing(0)
                    : theme.spacing(10),
            }}
        >
            <Typography
                sx={{
                    width: smallScreen ? "100%" : "60%",
                    padding: theme.spacing(3),
                    margin: theme.spacing(3),
                    marginTop: smallScreen
                        ? theme.spacing(0)
                        : theme.spacing(3),
                    wordBreak: "break-word",
                    bgcolor: "background.paper",
                    border: "1px solid",
                }}
                variant="body1"
            >
                {text}
            </Typography>
            <Box
                sx={{
                    width: smallScreen ? "100%" : "40%",
                    height: "100%",
                    maxHeight: smallScreen ? undefined : "40vh",
                }}
            >
                <img src={image} style={{ width: "100%", height: "100%" }} />
            </Box>
        </Box>
    )
}

export function About() {
    return (
        <Box>
            <ImageText
                image="/dom.jpeg"
                text="My name is Dominic Taylor, a software engineer, currently working at Improbable on our metaverse platform. I work as a full stack engineer using a wide range of technologies and dealing with everything from frontend; backend; infrastructure and design. In paticular enjoy product focessed work. Prior to working at improbable I worked in the finanacial industry as a quant."
                reverse={false}
            />

            <ImageText
                image="/ski.jpeg"
                text="Currently I am travelling around Japan and Soueth East Asia. Setting off in early February and heading to the far north, Hokkaido, and spending the next month or so working my way down to Osaka, skiing along the way. After that I'll be heading to Taiwan for a couple weeks; then Malayasia to meet some friends from university. Following that I'll have two months to get from the south of Vietnam to Bangkok where I'll fly to Lisbon for a few days; and then my final international stop Norway for kayaking through the fjords. Lastly, I'll be back in the UK mid June for Gklastonbury before heading back to London and work a couple weeks later."
                reverse={true}
            />
        </Box>
    )
}
