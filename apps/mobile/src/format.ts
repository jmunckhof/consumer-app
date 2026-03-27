const symbols: Record<string, string> = {
  EUR: "€", USD: "$", GBP: "£", JPY: "¥", CHF: "CHF",
  CAD: "CA$", AUD: "A$", SEK: "kr", NOK: "kr", DKK: "kr",
  PLN: "zł", CZK: "Kč", BRL: "R$", INR: "₹", TRY: "₺",
};

const suffixCurrencies = ["SEK", "NOK", "DKK", "PLN", "CZK", "HUF"];

export function formatPrice(cents: number, currency = "EUR"): string {
  const symbol = symbols[currency] ?? currency;
  const value = (cents / 100).toFixed(2);
  if (suffixCurrencies.includes(currency)) return `${value} ${symbol}`;
  return `${symbol}${value}`;
}
