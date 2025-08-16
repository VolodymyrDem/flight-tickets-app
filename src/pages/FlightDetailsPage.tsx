import { Alert, Breadcrumbs, Button, Card, CardContent, CircularProgress, Link, Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { getFlightById } from '@/api/flightsApi'
import type { Flight } from '@/types/flight'
import type { Seat } from '@/types/seat'
import SeatGrid from '@/components/SeatGrid'
import { addItem } from '@/redux/cartSlice'
import { useAppDispatch } from '@/redux/store'

function seededRandom(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = s * 16807 % 2147483647) / 2147483647
}

function generateSeats(): Seat[] {
  const rand = seededRandom(5)
  const rows = 10
  const cols = 6
  const seats: Seat[] = []
  for (let r = 1; r <= rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = `${String.fromCharCode(65 + c)}${r}`
      const occupied = rand() < 0.3
      seats.push({ id, row: r, col: c, occupied })
    }
  }
  return seats
}

export default function FlightDetailsPage() {
  const { id = '' } = useParams()
  const [flight, setFlight] = useState<Flight | null>(null)
  const [seats, setSeats] = useState<Seat[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const f = await getFlightById(id)
        setFlight(f)
        setSeats(generateSeats())
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load flight')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const selectedCount = useMemo(()=>seats?.filter(s=>s.selected).length ?? 0, [seats])

  const onToggleSeat = (seat: Seat) => {
    setSeats(prev => prev?.map(s => s.id === seat.id ? { ...s, selected: !s.selected } : s) ?? null)
  }

  const addSelectedToCart = () => {
    if (!flight || !seats) return
    seats.filter(s => s.selected).forEach(s => {
      dispatch(addItem({
        id: `${flight.id}-${s.id}`,
        flightId: flight.id,
        seatId: s.id,
        price: flight.price ?? 0,
        meta: {
          airline: flight.airline,
          from: flight.from,
          to: flight.to,
          departure: flight.departure
        }
      }))
    })
    setSeats(prev => prev?.map(s => ({...s, selected: false})) ?? null)
  }

  return (
    <Stack spacing={2}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link component={RouterLink} to="/">Flights</Link>
        <Typography color="text.primary">#{id}</Typography>
      </Breadcrumbs>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {flight && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Flight #{flight.id}: {flight.from} → {flight.to}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Airline: <strong>{flight.airline}</strong> — Dep: {flight.departure || '—'} — Arr: {flight.arrival || '—'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Terminal: {flight.terminal} — Gate: {flight.gate}
            </Typography>
            <Typography variant="h6" gutterBottom>Seats</Typography>
            {seats && <SeatGrid seats={seats} onToggle={onToggleSeat} />}
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="contained" disabled={!selectedCount} onClick={addSelectedToCart}>
                Add {selectedCount || ''} to cart
              </Button>
              <Button variant="outlined" component={RouterLink} to="/cart">
                Go to cart
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  )
}
