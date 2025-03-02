export function formatMoney(value, locale = "hu-HU", currency = "HUF") {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  });
  return formatter.format(value);
}
