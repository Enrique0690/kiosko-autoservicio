import React from 'react';
import * as Localization from 'expo-localization';

function CurrencySymbol() {
  const locales = Localization.getLocales();
  const locale = locales[0]?.languageTag || 'en-US';  
  const currency = locales[0]?.currencyCode || 'USD'; 
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol', 
  });
  const formattedParts = formatter.formatToParts(0);
  const symbol = formattedParts.find(part => part.type === 'currency')?.value || '$';

  return <>{symbol}</>; 
}

export default CurrencySymbol;