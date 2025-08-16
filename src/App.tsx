import { AppBar, Badge, Box, Container, IconButton, Toolbar, Typography } from '@mui/material'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Route, Routes, Link as RouterLink } from 'react-router-dom'
import FlightsPage from './pages/FlightsPage'
import FlightDetailsPage from './pages/FlightDetailsPage'
import CartPage from './pages/CartPage'
import { useAppSelector } from './redux/store'

export default function App() {
  const cartSize = useAppSelector(s => s.cart.items.length)
  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
          <FlightTakeoffIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            color="inherit"
            sx={{ textDecoration: 'none', flexGrow: 1 }}
          >
            Flight Tickets
          </Typography>
          <IconButton color="inherit" component={RouterLink} to="/cart">
            <Badge badgeContent={cartSize} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container sx={{ my: 3 }}>
        <Routes>
          <Route path="/" element={<FlightsPage />} />
          <Route path="/flights/:id" element={<FlightDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Container>
    </Box>
  )
}
