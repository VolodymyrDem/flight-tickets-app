export type Flight = {
  id: string
  airline?: string
  from?: string
  to?: string
  departure?: string 
  arrival?: string 
  price?: number
  terminal?: string
  gate?: string
  tickets?: { total: number; remaining: number }
  [k: string]: any
}
