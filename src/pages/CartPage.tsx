import { Alert, Button, Card, CardActions, CardContent, Divider, IconButton, Stack, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { clear, removeItem } from '@/redux/cartSlice'

export default function CartPage() {
  const items = useAppSelector(s => s.cart.items)
  const dispatch = useAppDispatch()
  const total = items.reduce((acc, i) => acc + (i.price ?? 0), 0)

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Cart</Typography>
      {!items.length && <Alert severity="info">Your cart is empty.</Alert>}
      {items.map(i => (
        <Card key={i.id} variant="outlined">
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Typography variant="subtitle1">
                Flight #{i.flightId} — Seat {i.seatId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {i.meta?.airline} {i.meta?.from} → {i.meta?.to} — Dep: {i.meta?.departure || '—'}
              </Typography>
              <Typography variant="h6">${i.price.toFixed(2)}</Typography>
              <IconButton onClick={()=>dispatch(removeItem(i.id))} aria-label="remove">
                <DeleteIcon />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>
      ))}
      {!!items.length && (
        <Card>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h5">${total.toFixed(2)}</Typography>
            </Stack>
          </CardContent>
          <Divider />
          <CardActions>
            <Button color="error" onClick={()=>dispatch(clear())} startIcon={<DeleteIcon />}>
              Clear cart
            </Button>
            <Button variant="contained" disabled>Checkout</Button>
          </CardActions>
        </Card>
      )}
    </Stack>
  )
}
