import { JotaiUser } from '@/types';
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
