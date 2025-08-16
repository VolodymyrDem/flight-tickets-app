// src/components/SeatGrid.tsx
import { Box, Button, Tooltip, Typography } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block'
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal'
import type { Seat } from '@/types/seat'

type Props = {
  seats: Seat[]
  onToggle: (seat: Seat) => void
}

export default function SeatGrid({ seats, onToggle }: Props) {
  if (!seats?.length) return null

  const rows = Math.max(...seats.map(s => s.row))
  const cols = Math.max(...seats.map(s => s.col)) + 1
  const colLabels = Array.from({ length: cols }, (_, c) => String.fromCharCode(65 + c))

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `56px repeat(${cols}, 72px)`,
        rowGap: 1.25,
        columnGap: 1.25,
        justifyContent: 'start',
        alignItems: 'center',
        p: 1,
        borderRadius: 2,
        border: theme => `1px solid ${theme.palette.divider}`,
        backgroundColor: theme => (theme.palette.mode === 'light' ? '#fff' : 'transparent')
      }}
    >
      <Box />
      {colLabels.map(label => (
        <Typography
          key={label}
          variant="body2"
          fontWeight={600}
          sx={{ textAlign: 'center', opacity: 0.8 }}
        >
          {label}
        </Typography>
      ))}

      {Array.from({ length: rows }, (_, i) => i + 1).map(r => (
        <Box key={r} sx={{ display: 'contents' }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ textAlign: 'center', opacity: 0.8 }}
          >
            {r}
          </Typography>

          {colLabels.map((_, c) => {
            const seat = seats.find(s => s.row === r && s.col === c)
            if (!seat) return <Box key={`${r}-${c}`} />

            const disabled = !!seat.occupied
            const selected = !!seat.selected

            return (
              <Tooltip
                key={seat.id}
                title={disabled ? `${seat.id} — occupied` : `${seat.id}`}
                arrow
                placement="top"
              >
                <span>
                  <Button
                    size="small"
                    variant={selected ? 'contained' : 'outlined'}
                    color={selected ? 'primary' : 'inherit'}
                    disabled={disabled}
                    onClick={() => onToggle(seat)}
                    sx={{
                      width: 72,
                      minWidth: 72,
                      height: 40,
                      borderRadius: 2,
                      fontWeight: 600,
                      justifyContent: 'center',
                      gap: 0.5,
                      '& .MuiButton-startIcon': { mr: 0 },
                    }}
                    startIcon={
                      disabled ? <BlockIcon fontSize="small" /> : <AirlineSeatReclineNormalIcon fontSize="small" />
                    }
                  >
                    {seat.id}
                  </Button>
                </span>
              </Tooltip>
            )
          })}
        </Box>
      ))}
    </Box>
  )
}
