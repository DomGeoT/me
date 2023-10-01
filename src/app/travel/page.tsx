'use client'
import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { GetTripsResponse, PostTripRequest } from '../types/api/trips';
import { Button } from '@mui/material';

export default function TravelPage() {
  const [trips, setTrips] = React.useState<GetTripsResponse["trips"]>([])
  const [addingTrip, setAddingTrip] = React.useState(false)
  React.useEffect(() => {
    async function f() {
      const x = await fetch("/api/trips", { method: "GET" })
      if (!x.ok) {
        return
      }
      const y = await x.json() as GetTripsResponse
      setTrips(y.trips)
    }
    void f()
  }, [])

  const handleCreateTrip = React.useCallback(async () => {
    setAddingTrip(true)
    const body: PostTripRequest = {
      name: "Test"
    }
    const x = await fetch("/api/trips", { method: "POST", body: JSON.stringify(body) })
    if (!x.ok) {
      return
    }
    setAddingTrip(false)
  }, [])

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button onClick={handleCreateTrip} disabled={addingTrip}>Add trip</Button>
        <Typography variant="body1" gutterBottom>
          Travel Page
        </Typography>
        {trips.map((trip) => (<Typography variant="body1">{trip.name}</Typography>))}
      </Box>
    </Container>
  );
}
