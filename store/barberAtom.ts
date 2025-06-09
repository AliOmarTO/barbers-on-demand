// store/barberAtom.ts
import { Barber, Booking } from '@/types';
import { atom } from 'jotai';

export const selectedBarberAtom = atom<Barber | null>(null);

export const confirmedBookingsAtom = atom<Booking[]>([]);

export const barbersAtom = atom([
  {
    id: '1',
    name: 'Tom Marelli',
    price: 45,
    rating: 5,
    reviews: 124,
    clients: 120,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    address: '123 King St W, Toronto',
    coordinate: { latitude: 43.6532, longitude: -79.3832 },
  },
  {
    id: '2',
    name: 'Jane Kim',
    price: 40,
    rating: 4,
    reviews: 110,
    clients: 98,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    address: '456 Queen St E, Toronto',
    coordinate: { latitude: 43.654, longitude: -79.38 },
  },
  {
    id: '3',
    name: 'Alex Nguyen',
    price: 38,
    rating: 4,
    reviews: 89,
    clients: 150,
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    address: '789 Dundas St W, Toronto',
    coordinate: { latitude: 43.652, longitude: -79.39 },
  },
  {
    id: '4',
    name: 'Maria Lopez',
    price: 42,
    rating: 4,
    reviews: 102,
    clients: 130,
    avatar: 'https://randomuser.me/api/portraits/women/52.jpg',
    address: '321 Bloor St, Toronto',
    coordinate: { latitude: 43.6677, longitude: -79.3948 },
  },
  {
    id: '5',
    name: 'Chris Patel',
    price: 35,
    rating: 4,
    reviews: 78,
    clients: 90,
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
    address: '987 College St, Toronto',
    coordinate: { latitude: 43.6561, longitude: -79.4202 },
  },
  {
    id: '6',
    name: 'Sofia Hassan',
    price: 37,
    rating: 5,
    reviews: 120,
    clients: 112,
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    address: '654 Bathurst St, Toronto',
    coordinate: { latitude: 43.6592, longitude: -79.4071 },
  },
  {
    id: '7',
    name: 'Liam O’Connor',
    price: 50,
    rating: 5,
    reviews: 150,
    clients: 200,
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    address: '159 Spadina Ave, Toronto',
    coordinate: { latitude: 43.6487, longitude: -79.3975 },
  },
]);
