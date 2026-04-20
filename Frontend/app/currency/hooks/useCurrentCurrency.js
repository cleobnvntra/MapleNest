import { currencyAtom } from '@/app/currency/data/atoms'
import { useAtom } from 'jotai'

const useCurrentCurrency = () => {
  return useAtom(currencyAtom);
}

export default useCurrentCurrency