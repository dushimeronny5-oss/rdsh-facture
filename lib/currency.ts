export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  decimals: number;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  {
    code: "BIF",
    name: "Franc burundais (FBu)",
    symbol: "FBu",
    flag: "🇧🇮",
    decimals: 0,
  },
  {
    code: "CAD",
    name: "Dollar canadien (CAD)",
    symbol: "$ CA",
    flag: "🇨🇦",
    decimals: 2,
  },
  {
    code: "USD",
    name: "Dollar américain (USD)",
    symbol: "$ US",
    flag: "🇺🇸",
    decimals: 2,
  },
  {
    code: "EUR",
    name: "Euro (EUR)",
    symbol: "€",
    flag: "🇪🇺",
    decimals: 2,
  },
];

export function getCurrency(code: string = "BIF"): CurrencyOption {
  const found = SUPPORTED_CURRENCIES.find(
    (c) => c.code.toUpperCase() === code.toUpperCase()
  );
  return found || SUPPORTED_CURRENCIES[0];
}
