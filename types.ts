export interface Booking {
  id: string;
  barber: Barber;
  serviceType: string; // 'shop' | 'house'
  paymentMethod: string;
  notes?: string;
  date: string;
  time: string;
  location: string;
}

export interface JotaiUser {
  id: string;
  firstName: string;
  lastName: string;
  completedOnboarding?: boolean;
  type?: 'barber' | 'client';
  address?: string;
  email: string;
  phone?: number;
  profileImage?: string;
  bookings?: Booking[];
}

export interface Barber {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  clients: number;
  avatar: string;
  address: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

export interface Client extends User {}
