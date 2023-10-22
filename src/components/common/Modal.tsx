"use client"
import { Card, Modal as _Modal } from "@mui/material"
import * as React from "react"

type Props = Readonly<{
    open: boolean
    onClose: () => void
    children: React.ReactNode
}>

export function Modal({ open, onClose, children }: Props) {
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
                    borderRadius: "30px",
                    maxHeight: "80vh",
                    overflowX: "scroll",
                }}
            >
                {children}
            </Card>
        </_Modal>
    )
}
