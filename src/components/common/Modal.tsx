"use client"
import { Card, Modal as _Modal } from "@mui/material"
import * as React from "react"

type Props = Readonly<{
    open: boolean
    onClose: () => void
    children: React.ReactNode
    sx?: React.CSSProperties
}>

export function Modal({ open, onClose, children, sx }: Props) {
    return (
        <_Modal open={open} onClose={onClose}>
            <Card
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "90vw",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    maxHeight: "80vh",
                    overflowX: "scroll",
                    border: "1px solid",
                    borderRadius: "0px",
                    ...sx,
                }}
            >
                {children}
            </Card>
        </_Modal>
    )
}
