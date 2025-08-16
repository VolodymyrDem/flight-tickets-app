import { configureStore } from '@reduxjs/toolkit'
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import cartReducer, { type CartState } from './cartSlice'
import { load, save } from '@/utils/localStorage'

const PERSIST_KEY = 'cart_state_v1'

const preloadedState = {
  cart: load<CartState>(PERSIST_KEY, { items: [] })
}

export const store = configureStore({
  reducer: {
    cart: cartReducer
  },
  preloadedState
})

store.subscribe(() => {
  const state = store.getState()
  save<CartState>(PERSIST_KEY, state.cart)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
