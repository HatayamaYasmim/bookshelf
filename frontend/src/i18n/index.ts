import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enUS from './locales/en-US.json';
import ptBR from './locales/pt-BR.json';

const savedLanguage = localStorage.getItem('bookshelf-language');
const browserLanguage = navigator.language.startsWith('pt') ? 'pt-BR' : 'en-US';

i18n.use(initReactI18next).init({
  resources: {
    'en-US': {
      translation: enUS,
    },
    'pt-BR': {
      translation: ptBR,
    },
  },

  lng: savedLanguage ?? browserLanguage,

  fallbackLng: 'en-US',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
