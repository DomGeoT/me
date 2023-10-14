'use client'
import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { GetTripsResponse, PostTripRequest } from '../types/api/trips';
import { Button, Card, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Add, FmdGood, RemoveRedEye } from '@mui/icons-material';
import { NewTripModal } from '@/components';
import Marked from "marked-react"

type TripCardProps = Readonly<{ _id: string, name: string, rawMarkdownContent: string, longitude: number, latitude: number }>

function TripCard({ _id, name, rawMarkdownContent, longitude, latitude }: TripCardProps) {
  const theme = useTheme();
  return (
    <Card sx={{
      marginY: "5px",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      padding: theme.spacing(4),
    }}
    >
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between", // Added this to push buttons to the right
        alignItems: "center",
      }}>
        <Typography variant="h6">{name}</Typography>
        <Box sx={{ "& > *": { ml: "4px" } }}>
          <IconButton href={`/trips/${_id}`}><RemoveRedEye /></IconButton>
          <IconButton href={`https://www.google.com/maps/@${longitude},${latitude}`} target="_blank">
            <FmdGood />
          </IconButton>
        </Box>
      </Box>

      <Marked>{rawMarkdownContent}</Marked>
    </Card>
  );
}


export default function TravelPage() {
  const [trips, setTrips] = React.useState<GetTripsResponse["trips"]>([])
  const [tripsModalOpen, setTripsModalOpen] = React.useState(false)
  React.useEffect(() => {
    async function f() {
      const res = await fetch("/api/trips", { method: "GET" })
      if (!res.ok) {
        return
      }
      const y = await res.json() as GetTripsResponse
      setTrips(y.trips)
    }
    void f()
  }, [])

  const handleToggleTripsModal = React.useCallback(() => { setTripsModalOpen(state => !state) }, [])


  return (
    <Container>
      <title>Dom Taylor | Travel</title>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          {trips.map((trip) => (<TripCard _id={trip._id}
            name={trip.heading}
            rawMarkdownContent={trip.rawMarkdownContent}
            longitude={trip.longitude}
            latitude={trip.latitude} />
          ))}</Box>

      </Box>
      <IconButton onClick={handleToggleTripsModal} disabled={tripsModalOpen}
        sx={{
          position: "fixed",
          bottom: '32px',
          right: "32px"
        }}>
        <Add />
      </IconButton>
      <NewTripModal open={tripsModalOpen} onClose={handleToggleTripsModal} />
    </Container>
  );
}
