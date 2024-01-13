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
                image="/temp.jpg"
                text="My name is Dominic Taylor, a software engineer, currently working at Improbable on our metaverse platform. I work as a full stack engineer using a wide range of technologies and dealing with everything from frontend; backend; infrastructure and design. In paticular enjoy product focessed work. Prior to working at improbable I worked in the finanacial industry as a quant."
                reverse={false}
            />

            <ImageText
                image="/mountain.jpg"
                text="ksjhdbfkwjnjfkew fwhouejkbnfjweonf ewwheoiljbnfjwebfw fwoeibfkjwrebfjkewbn fewoifhewoinfowjenofjwen fwoeinfjlwnfojlwenfjwl wefiownejlfnwoif weoisdfnwejdsnfowensfwe sfowiendfokwenfoiwnosifgnwre fwnoidlknfoweinfokwndnf wesoifhwroisnfowelnfowenfweoi"
                reverse={true}
            />

            <ImageText
                image="/paddy.jpeg"
                text="ksjhdbfkwjnjfkew fwhouejkbnfjweonf ewwheoiljbnfjwebfw fwoeibfkjwrebfjkewbn fewoifhewoinfowjenofjwen fwoeinfjlwnfojlwenfjwl wefiownejlfnwoif weoisdfnwejdsnfowensfwe sfowiendfokwenfoiwnosifgnwre fwnoidlknfoweinfokwndnf wesoifhwroisnfowelnfowenfweoi"
                reverse={false}
            />
        </Box>
    )
}
