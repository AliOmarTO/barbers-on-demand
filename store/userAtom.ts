import { JotaiUser } from '@/types';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const userAtom = atom<JotaiUser | null>(null);

export const registeredUsersAtom = atomWithStorage<JotaiUser[]>('registeredUsers', []);
