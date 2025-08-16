import {Card, CardActionArea, CardContent, CardHeader, Chip, IconButton, Stack, Typography, Grid} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/StarBorder'
import FavoriteFilled from '@mui/icons-material/Star'
import LaunchIcon from '@mui/icons-material/Launch'
import { Link as RouterLink } from 'react-router-dom'
import type { Flight } from '@/types/flight'
import { useState } from 'react'

type Props = {
  flight: Flight
}

export default function FlightCard({ flight }: Props) {
  const [fav, setFav] = useState<boolean>(() => {
    const key = `fav_${flight.id}`
    return localStorage.getItem(key) === '1'
  })

  const toggleFav = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const key = `fav_${flight.id}`
    const next = !fav
    setFav(next)
    localStorage.setItem(key, next ? '1' : '0')
  }

  return (
    <Card variant="outlined">
      <CardHeader
        title={`${flight.from} → ${flight.to}`}
        subheader={flight.airline}
        action={
          <IconButton onClick={toggleFav} aria-label="add to favorites">
            {fav ? <FavoriteFilled color="warning" /> : <FavoriteIcon />}
          </IconButton>
        }
        sx={{ '& .MuiCardHeader-title': { wordBreak: 'break-word' } }}
      />
      <CardActionArea component={RouterLink} to={`/flights/${flight.id}`}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid>
              <Stack
                direction="row"
                spacing={1}
                rowGap={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <Chip label={`Dep: ${flight.departure || '—'}`} />
                <Chip label={`Arr: ${flight.arrival || '—'}`} />
              </Stack>
            </Grid>
            <Grid>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="flex-end"
                flexWrap="wrap"
              >
                <Chip label={`Terminal: ${flight.terminal}`} />
                <Chip
                  label={`Gate: ${flight.gate}`}
                  icon={<LaunchIcon />}
                />
              </Stack>
            </Grid>
            <Grid>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                flexWrap="wrap"
              >
                <Typography
                  variant="h6"
                  sx={{ wordBreak: 'break-word' }}
                >
                  Price: ${flight.price?.toFixed?.(2) ?? flight.price}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ wordBreak: 'break-word' }}
                >
                  Tickets: {flight.tickets?.remaining ?? '—'}/
                  {flight.tickets?.total ?? '—'}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
