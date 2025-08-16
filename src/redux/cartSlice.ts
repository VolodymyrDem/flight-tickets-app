import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type CartItem = {
  id: string
  flightId: string
  seatId: string
  price: number
  meta?: {
    airline?: string
    from?: string
    to?: string
    departure?: string
  }
}

export type CartState = {
  items: CartItem[]
}

const initialState: CartState = {
  items: []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const exists = state.items.some(i => i.id === action.payload.id)
      if (!exists) state.items.push(action.payload)
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id != action.payload)
    },
    clear(state) {
      state.items = []
    }
  }
})

export const { addItem, removeItem, clear } = cartSlice.actions
export default cartSlice.reducer
