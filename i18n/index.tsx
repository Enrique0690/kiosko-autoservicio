if (typeof Intl.PluralRules === 'undefined')  require('@formatjs/intl-pluralrules');
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const en = {
  common: require('./languages/en/common.json'),
  integrations: require('./languages/en/integrations.json'),
  layout: require('./languages/en/layout.json'),
  organization: require('./languages/en/organization.json'),
  paymentmethods: require('./languages/en/paymentmethods.json'),
  printers: require('./languages/en/printers.json'),
  security: require('./languages/en/security.json'),
  stations: require('./languages/en/stations.json'),
  tablelayout: require('./languages/en/tablelayout.json'),
  advancedoptions: require('./languages/en/advancedoptions.json')
};

const es = {
  common: require('./languages/es/common.json'),
  integrations: require('./languages/es/integrations.json'),
  layout: require('./languages/es/layout.json'),
  organization: require('./languages/es/organization.json'),
  paymentmethods: require('./languages/es/paymentmethods.json'),
  printers: require('./languages/es/printers.json'),
  security: require('./languages/es/security.json'),
  stations: require('./languages/es/stations.json'),
  tablelayout: require('./languages/es/tablelayout.json'),
  advancedoptions: require('./languages/es/advancedoptions.json')
};

i18n
  .use(initReactI18next) 
  .init({
    resources: {
      en: {
        translation: en, 
      },
      es: {
        translation: es, 
      }
    },
    lng: 'es',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    pluralSeparator: '_',
    compatibilityJSON: 'v3',
  });
