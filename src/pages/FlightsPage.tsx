import { Alert, CircularProgress, Grid, ListItemIcon, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { getFlights } from '@/api/flightsApi'
import type { Flight } from '@/types/flight'
import FlightCard from '@/components/FlightCard'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sort, setSort] = useState<'priceAsc' | 'priceDesc' | 'depAsc' | 'depDesc'>('priceAsc')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getFlights()
        setFlights(data)
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load flights')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    let res = flights
    if (s) {
      res = res.filter(f =>
        (f.airline ?? '').toLowerCase().includes(s) ||
        (f.from ?? '').toLowerCase().includes(s) ||
        (f.to ?? '').toLowerCase().includes(s)
      )
    }
    switch (sort) {
      case 'priceAsc': res = [...res].sort((a,b)=>(a.price??0)-(b.price??0)); break
      case 'priceDesc': res = [...res].sort((a,b)=>(b.price??0)-(a.price??0)); break
      case 'depAsc': res = [...res].sort((a,b)=>String(a.departure).localeCompare(String(b.departure))); break
      case 'depDesc': res = [...res].sort((a,b)=>String(b.departure).localeCompare(String(a.departure))); break
    }
    return res
  }, [flights, sort, search])

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Available Flights</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Search (airline/from/to)"
          value={search}
          onChange={e=>setSearch(e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Sort by"
          value={sort}
          onChange={e=>setSort(e.target.value as any)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="priceAsc">Price
            <ListItemIcon>
              <ArrowUpwardIcon fontSize="small" />
            </ListItemIcon>
          </MenuItem>
          <MenuItem value="priceDesc">Price
            <ListItemIcon>
              <ArrowDownwardIcon fontSize="small" />
            </ListItemIcon>
          </MenuItem>
          <MenuItem value="depAsc">Departure
            <ListItemIcon>
              <ArrowUpwardIcon fontSize="small" />
            </ListItemIcon>
          </MenuItem>
          <MenuItem value="depDesc">Departure
            <ListItemIcon>
              <ArrowDownwardIcon fontSize="small" />
            </ListItemIcon>
          </MenuItem>
        </TextField>
      </Stack>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
      {filtered.map(f => (
        <Grid key={f.id}>
          <FlightCard flight={f} />
        </Grid>
      ))}
    </Grid>
  </Stack>
  )
}
