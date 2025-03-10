/**
 * @param {number} value
 * @param {string} locale
 * @param {string} currency
 * @returns {string}
 */
export function formatMoney(value, locale = "hu-HU", currency = "HUF") {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  });
  return formatter.format(value);
}

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {number} length
 * @returns {string}
 */
export function makeID(length) {
  let result = "";
  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    counter += 1;
  }
  return result;
}
