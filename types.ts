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

export interface BarberOnboardingData {
  firstName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  businessType: 'mobile' | 'shop' | 'both';
  availability: {
    [key: string]: {
      isAvailable: boolean;
      startTime: string;
      endTime: string;
    };
  };
  photos: string[];
}

export interface BookingInterface {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  startTime: Date;
  endTime: Date;
  price: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  isFirstTime: boolean;
  notes?: string;
}

export interface Client extends User {}
