import { Jost } from "next/font/google"
import { createTheme } from "@mui/material/styles"

const jost = Jost({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
})

const palette = {
    primary: {
        main: "#FF5733",
        light: "#ffffff",
        dark: "#000000",
    },
    secondary: {
        main: "#E0C2FF",
        light: "#000000",
        dark: "#ffffff",
        contrastText: "#47008F",
    },
    background: {
        paper: "#fAfAfA",
        default: "#ffffff",
    },
}

const theme = createTheme({
    palette,
    typography: {
        fontFamily: jost.style.fontFamily,
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                root: ({ ownerState }) => ({
                    ...(ownerState.severity === "info" && {
                        backgroundColor: "secondary.contrastText",
                    }),
                }),
            },
        },
        MuiButton: {
            variants: [
                {
                    props: { variant: "contained" },
                    style: {
                        backgroundColor: "theme.pallete.primary.main",
                        color: "background.default",
                        "& > *": {
                            color: "background.default",
                        },
                    },
                },
            ],
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: "200px",
                    paddingX: "15px",
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    backgroundColor: "primary.main",
                    color: "background.default",
                    "& > *": {
                        color: "background.default",
                    },
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    "& > *": {
                        color: "grey",
                    },
                    ":hover": {
                        "& > *": {
                            color: "primary.main",
                        },
                    },
                },
            },
        },
        MuiTypography: {
            variants: [
                {
                    props: { variant: "h1" },
                    style: {
                        backgroundColor: palette.primary.dark,
                        color: palette.primary.light,
                    },
                },
                {
                    props: { variant: "h2" },
                    style: {
                        backgroundColor: palette.primary.dark,
                        color: palette.primary.light,
                    },
                },
                {
                    props: { variant: "h3" },
                    style: {
                        backgroundColor: palette.primary.dark,
                        color: palette.primary.light,
                    },
                },
                {
                    props: { variant: "h4" },
                    style: {
                        backgroundColor: palette.primary.dark,
                        color: palette.primary.light,
                    },
                },
                {
                    props: { variant: "body2" },
                    style: {
                        backgroundColor: palette.primary.dark,
                        color: palette.primary.light,
                    },
                },
            ],
            styleOverrides: {
                root: {
                    backgroundColor: "transparent",
                    color: palette.primary.dark,
                },
            },
        },
    },
})

export default theme
