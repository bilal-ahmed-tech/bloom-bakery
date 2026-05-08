/**
 * Format currency to Pakistani Rupees
 */
export function formatPKR(amount: number): string {
  return `PKR ${new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 0,
  }).format(amount)}`;
}
/**
 * Format currency to US Dollars
*/
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

/**
 * Generate WhatsApp message link
 */
export function whatsappLink(message: string): string {
  return `https://wa.me/923001234567?text=${encodeURIComponent(message)}`;
}