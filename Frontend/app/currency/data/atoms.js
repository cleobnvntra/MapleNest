import { atomWithStorage } from 'jotai/utils';

export const currencyAtom = atomWithStorage('currency', 'CAD');