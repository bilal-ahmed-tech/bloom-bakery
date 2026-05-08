/**
 * Product categories
 */
export const CATEGORIES = [
  { label: "All", slug: "all" },
  { label: "Cakes", slug: "cakes" },
  { label: "Pastries", slug: "pastries" },
  { label: "Breads", slug: "breads" },
  { label: "Cookies", slug: "cookies" },
  { label: "Cupcakes", slug: "cupcakes" },
  { label: "Seasonal", slug: "seasonal" },
] as const;

/**
 * Delivery time slots
 */
export const DELIVERY_TIME_SLOTS = [
  "10:00 AM – 12:00 PM",
  "12:00 PM – 02:00 PM",
  "02:00 PM – 04:00 PM",
  "04:00 PM – 06:00 PM",
  "06:00 PM – 08:00 PM",
] as const;

/**
 * Pickup time slots
 */
export const PICKUP_TIME_SLOTS = [
  "09:00 AM – 10:00 AM",
  "11:00 AM – 12:00 PM",
  "01:00 PM – 02:00 PM",
  "03:00 PM – 04:00 PM",
] as const;

/**
 * Delivery fee thresholds and amounts
 */
export const DELIVERY_THRESHOLD = 2000; // Free delivery above this amount (PKR)
export const DELIVERY_FEE = 250; // Standard delivery fee (PKR)

/**
 * Order status configurations
 */
export const ORDER_STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-light text-amber",
    dot: "bg-amber",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
  },
  PREPARING: {
    label: "Preparing",
    className: "bg-purple-50 text-purple-600",
    dot: "bg-purple-500",
  },
  READY: {
    label: "Ready for Pickup",
    className: "bg-teal-50 text-teal-600",
    dot: "bg-teal-500",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-green-50 text-green-600",
    dot: "bg-green-500",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-rose/10 text-rose",
    dot: "bg-rose",
  },
} as const;
