const currencySymbols: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  JPY: "¥",
  CHF: "CHF",
  CAD: "CA$",
  AUD: "A$",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  PLN: "zł",
  CZK: "Kč",
  HUF: "Ft",
  BRL: "R$",
  MXN: "MX$",
  INR: "₹",
  CNY: "¥",
  KRW: "₩",
  TRY: "₺",
  ZAR: "R",
};

export function getCurrencySymbol(currency = "EUR"): string {
  return currencySymbols[currency] ?? currency;
}

export function formatPrice(cents: number, currency = "EUR"): string {
  const symbol = currencySymbols[currency] ?? currency;
  const value = (cents / 100).toFixed(2);

  // Currencies where symbol goes after the number
  const suffixCurrencies = ["SEK", "NOK", "DKK", "PLN", "CZK", "HUF"];
  if (suffixCurrencies.includes(currency)) {
    return `${value} ${symbol}`;
  }

  return `${symbol}${value}`;
}
