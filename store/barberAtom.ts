// store/barberAtom.ts
import { Barber } from '@/types';
import { atom } from 'jotai';

export const selectedBarberAtom = atom<Barber | null>(null);

export const barbersAtom = atom([
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://example.com/john-avatar.png',
    price: 30,
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://example.com/jane-avatar.png',
    price: 35,
  },
  // Add more mock barbers here
]);
