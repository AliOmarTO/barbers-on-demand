import { JotaiUser } from '@/types';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const userAtom = atomWithStorage<JotaiUser | null>('user', null);
