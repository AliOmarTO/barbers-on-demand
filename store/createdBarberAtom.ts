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

// Create initial barber instance
const createInitialBarber = (): Barber => {
  return new Barber({
    id: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    profileImage: '',
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
