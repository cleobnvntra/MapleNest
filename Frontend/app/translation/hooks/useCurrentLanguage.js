import { useTranslation } from 'react-i18next';

const useCurrentLanguage = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  return currentLanguage;
}

export default useCurrentLanguage