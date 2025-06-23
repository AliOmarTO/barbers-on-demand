import { atom } from 'jotai';
import {
  Barber,
  ServiceType,
  AvailabilityStatus,
  VerificationStatus,
  MobileServiceInfo,
  ShopInfo,
  Service,
  Availability,
} from '../models/Barber';
import { BookingInterface } from '@/types';

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const currentDay = currentDate.getDate();

// mock data just to simulate bookings for the barber
// This data can be replaced with actual API calls or database queries in a real application
const mockBookings: BookingInterface[] = [
  {
    id: '1',
    clientName: 'John Smith',
    clientPhone: '(555) 123-4567',
    serviceName: 'Haircut & Beard Trim',
    startTime: new Date(currentYear, currentMonth, currentDay, 9, 0), // Current year/month, 17th day, 9:00 AM
    endTime: new Date(currentYear, currentMonth, currentDay, 10, 0),
    price: 45,
    status: 'confirmed',
    isFirstTime: false,
  },
  {
    id: '2',
    clientName: 'Mike Johnson',
    clientPhone: '(555) 987-6543',
    serviceName: 'Premium Haircut',
    startTime: new Date(currentYear, currentMonth, currentDay + 1, 11, 30), // Current year/month, 17th day, 11:30 AM
    endTime: new Date(currentYear, currentMonth, currentDay + 1, 12, 30),
    price: 35,
    status: 'confirmed',
    isFirstTime: true,
    notes: 'First time client - wants a modern fade',
  },
  {
    id: '3',
    clientName: 'David Wilson',
    clientPhone: '(555) 456-7890',
    serviceName: 'Beard Styling',
    startTime: new Date(currentYear, currentMonth, currentDay, 14, 0), // Current year/month, 17th day, 2:00 PM
    endTime: new Date(currentYear, currentMonth, currentDay, 14, 45),
    price: 25,
    status: 'pending',
    isFirstTime: false,
  },
  {
    id: '4',
    clientName: 'Alex Brown',
    clientPhone: '(555) 321-0987',
    serviceName: 'Full Service Package',
    startTime: new Date(currentYear, currentMonth, currentDay + 1, 10, 0), // Current year/month, 18th day, 10:00 AM
    endTime: new Date(currentYear, currentMonth, currentDay + 1, 11, 30),
    price: 65,
    status: 'confirmed',
    isFirstTime: false,
  },
  {
    id: '5',
    clientName: 'Chris Davis',
    clientPhone: '(555) 654-3210',
    serviceName: 'Haircut',
    startTime: new Date(currentYear, currentMonth, currentDay + 2, 15, 30), // Current year/month, 19th day, 3:30 PM
    endTime: new Date(currentYear, currentMonth, currentDay + 2, 16, 30),
    price: 30,
    status: 'confirmed',
    isFirstTime: true,
  },
];

// Create initial barber instance
const createInitialBarber = (): Barber => {
  return new Barber({
    id: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    profileImage: '',
    bookings: mockBookings,
    serviceType: ServiceType.SHOP,
    currentStatus: AvailabilityStatus.AVAILABLE,
    verificationStatus: VerificationStatus.PENDING,
    isOnboarded: false,
    profile: {
      bio: '',
      specialties: [],
      portfolioImages: [],
      certifications: [],
      yearsExperience: 0,
      languages: ['English'],
    },
    businessInfo: {
      licenseNumber: '',
    },
  });
};

// Main barber atom
export const barberAtom = atom<Barber>(createInitialBarber());

// Derived atoms for specific parts of the barber data
export const barberBasicInfoAtom = atom(
  (get) => {
    const barber = get(barberAtom);
    return {
      firstName: barber.firstName,
      lastName: barber.lastName,
      email: barber.email,
      phone: barber.phone,
      profileImage: barber.profileImage,
    };
  },
  (
    get,
    set,
    update: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      profileImage: string;
    }>
  ) => {
    const barber = get(barberAtom);
    const updatedBarber = new Barber({
      ...barber,
      ...update,
      updatedAt: new Date(),
    });
    set(barberAtom, updatedBarber);
  }
);

export const barberBusinessInfoAtom = atom(
  (get) => {
    const barber = get(barberAtom);
    return barber.businessInfo;
  },
  (get, set, update: Partial<typeof Barber.prototype.businessInfo>) => {
    const barber = get(barberAtom);
    const updatedBarber = new Barber({
      ...barber,
      businessInfo: { ...barber.businessInfo, ...update },
      updatedAt: new Date(),
    });
    set(barberAtom, updatedBarber);
  }
);

export const barberServiceTypeAtom = atom(
  (get) => get(barberAtom).serviceType,
  (get, set, serviceType: ServiceType) => {
    const barber = get(barberAtom);
    const updatedBarber = new Barber({
      ...barber,
      serviceType,
      updatedAt: new Date(),
    });
    set(barberAtom, updatedBarber);
  }
);

export const barberMobileServiceAtom = atom(
  (get) => get(barberAtom).mobileServiceInfo,
  (get, set, mobileServiceInfo: MobileServiceInfo) => {
    const barber = get(barberAtom);
    const updatedBarber = new Barber({
      ...barber,
      mobileServiceInfo,
      updatedAt: new Date(),
    });
    set(barberAtom, updatedBarber);
  }
);

export const barberShopAtom = atom(
  (get) => get(barberAtom).ShopInfo,
  (get, set, ShopInfo: ShopInfo) => {
    const barber = get(barberAtom);
    const updatedBarber = new Barber({
      ...barber,
      ShopInfo,
      updatedAt: new Date(),
    });
    set(barberAtom, updatedBarber);
  }
);

export const barberAvailabilityAtom = atom(
  (get) => get(barberAtom).weeklyAvailability,
  (get, set, availability: Availability[]) => {
    const barber = get(barberAtom);
    const updatedBarber = new Barber({
      ...barber,
      weeklyAvailability: availability,
      updatedAt: new Date(),
    });
    set(barberAtom, updatedBarber);
  }
);

export const barberServicesAtom = atom(
  (get) => get(barberAtom).services,
  (get, set, services: Service[]) => {
    const barber = get(barberAtom);
    const updatedBarber = new Barber({
      ...barber,
      services,
      updatedAt: new Date(),
    });
    set(barberAtom, updatedBarber);
  }
);

export const barberPortfolioAtom = atom(
  (get) => get(barberAtom).profile.portfolioImages,
  (get, set, portfolioImages: string[]) => {
    const barber = get(barberAtom);
    const updatedBarber = new Barber({
      ...barber,
      profile: {
        ...barber.profile,
        portfolioImages,
      },
      updatedAt: new Date(),
    });
    set(barberAtom, updatedBarber);
  }
);

// Computed atoms
export const barberFullNameAtom = atom((get) => get(barberAtom).fullName);
export const barberCanAcceptBookingsAtom = atom((get) => get(barberAtom).canAcceptBookings);
export const barberIsFullyVerifiedAtom = atom((get) => get(barberAtom).isFullyVerified);
export const barberIsMobileServiceAtom = atom((get) => get(barberAtom).isMobileService);
export const barberHasShopAtom = atom((get) => get(barberAtom).hasShop);
