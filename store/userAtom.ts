import { BarberOnboardingData, JotaiUser } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

const storage = createJSONStorage<JotaiUser | null>(() => AsyncStorage);
export const userAtom = atomWithStorage<JotaiUser | null>('user', null, storage);

const storageArray = createJSONStorage<JotaiUser[]>(() => AsyncStorage);
//const content = [] as JotaiUser[] // anything JSON serializable
export const registeredUsersAtom = atomWithStorage<JotaiUser[]>(
  'registeredUsers',
  [],
  storageArray
);

export const wasJustSignedUpAtom = atom(false);

export const BarberOnboardingAtom = atom<BarberOnboardingData>({
  firstName: '',
  lastName: '',
  address: {
    street: '',
    city: '',
    province: '',
    postalCode: '',
  },
  businessType: 'shop',
  availability: {
    monday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
    tuesday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
    wednesday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
    thursday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
    friday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
    saturday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
    sunday: { isAvailable: false, startTime: '09:00', endTime: '17:00' },
  },
  photos: [],
});
