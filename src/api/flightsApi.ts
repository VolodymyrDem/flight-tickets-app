import axios from 'axios'
import type { Flight } from '@/types/flight'

const API = 'https://679d13f487618946e6544ccc.mockapi.io/testove/v1'

export async function getFlights(): Promise<Flight[]> {
  const { data } = await axios.get(`${API}/flights`)
  return (data as any[]).map((f) => ({
    ...f,
    id: String(f.id),
    airline: f.airline ?? f.company ?? 'Unknown Airline',
    from: f.from ?? f.origin ?? f.src ?? f.fromCity ?? 'N/A',
    to: f.to ?? f.destination ?? f.dst ?? f.toCity ?? 'N/A',
    departure: f.departure ?? f.departureTime ?? f.dep ?? f.time ?? '',
    arrival: f.arrival ?? f.arrivalTime ?? f.arr ?? '',
    price: typeof f.price === 'number' ? f.price : Number(f.price ?? 0),
    terminal: f.terminal ?? f.term ?? 'T1',
    gate: f.gate ?? 'A1',
    tickets: f.tickets ?? { total: f.totalTickets ?? 60, remaining: f.remainingTickets ?? 40 },
  
  })) as Flight[]
}

export async function getFlightById(id: string): Promise<Flight> {
  const { data } = await axios.get(`${API}/flights/${id}`)
  const f = data as any
  const base: Flight = {
    ...f,
    id: String(f.id),
    airline: f.airline ?? f.company ?? 'Unknown Airline',
    from: f.from ?? f.origin ?? 'N/A',
    to: f.to ?? f.destination ?? 'N/A',
    departure: f.departure ?? f.departureTime ?? '',
    arrival: f.arrival ?? f.arrivalTime ?? '',
    price: typeof f.price === 'number' ? f.price : Number(f.price ?? 0),
    terminal: f.terminal ?? 'T1',
    gate: f.gate ?? 'A1',
    tickets: f.tickets ?? { total: f.totalTickets ?? 60, remaining: f.remainingTickets ?? 40 },
  }
  return base
}
