"use client"

import { useSyncExternalStore } from "react"

// ─── Types ──────────────────────────────────────────────────

type CartItem = {
  id: string
  name: string
  category: string
  image: string
  pricePKR: number
  priceUSD: number
  variant?: string
  quantity: number
}

type AppliedCoupon = {
  code: string
  discount: number
}

type CartStore = {
  items: CartItem[]
  coupon: AppliedCoupon | null
}

// Internal shape stored in localStorage (with expiry timestamp)
type StoredCart = CartStore & {
  _timestamp?: number
}

// ─── Constants ──────────────────────────────────────────────

const STORAGE_KEY = "bloom-bakery-cart"
const CART_EXPIRY_MS = 8 * 60 * 60 * 1000 // 8 hours

// ─── Type guard ─────────────────────────────────────────────

function isCartItem(value: unknown): value is CartItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as Record<string, unknown>).id === "string" &&
    "name" in value &&
    typeof (value as Record<string, unknown>).name === "string" &&
    "quantity" in value &&
    typeof (value as Record<string, unknown>).quantity === "number"
  )
}

// ─── Persistence helpers ────────────────────────────────────

function loadFromStorage(): CartStore {
  if (typeof window === "undefined") return { items: [], coupon: null }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: [], coupon: null }

    const parsed: unknown = JSON.parse(raw)

    // Must be a non‑null object
    if (typeof parsed !== "object" || parsed === null) {
      return { items: [], coupon: null }
    }

    const data = parsed as Record<string, unknown>

    // Expiry check
    if (
      typeof data._timestamp === "number" &&
      Date.now() - data._timestamp > CART_EXPIRY_MS
    ) {
      localStorage.removeItem(STORAGE_KEY)
      return { items: [], coupon: null }
    }

    // Validate & clean items array
    const rawItems = data.items
    if (!Array.isArray(rawItems)) return { items: [], coupon: null }

    const cleanedItems: CartItem[] = rawItems
      .filter(isCartItem)
      .map((item) => ({
        ...item,
        quantity: Math.max(1, Math.floor(item.quantity)),
      }))

    // Validate coupon
    const rawCoupon = data.coupon
    const coupon =
      typeof rawCoupon === "object" &&
      rawCoupon !== null &&
      "code" in rawCoupon &&
      typeof (rawCoupon as Record<string, unknown>).code === "string" &&
      "discount" in rawCoupon &&
      typeof (rawCoupon as Record<string, unknown>).discount === "number"
        ? {
            code: (rawCoupon as Record<string, unknown>).code as string,
            discount: (rawCoupon as Record<string, unknown>).discount as number,
          }
        : null

    return { items: cleanedItems, coupon }
  } catch {
    return { items: [], coupon: null }
  }
}

function persist(state: CartStore) {
  if (typeof window === "undefined") return
  try {
    const data: StoredCart = { ...state, _timestamp: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // storage full or disabled – fail silently
  }
}

// ─── Store state & listeners ────────────────────────────────

let store: CartStore = loadFromStorage()
const listeners = new Set<() => void>()

// Stable snapshot for server rendering
const SERVER_SNAPSHOT: CartStore = { items: [], coupon: null }

function emitChange() {
  persist(store)
  listeners.forEach((l) => l())
}

function getSnapshot(): CartStore {
  return store
}

function getServerSnapshot(): CartStore {
  return SERVER_SNAPSHOT
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// ─── Public actions ─────────────────────────────────────────

export function addToCart(
  item: Omit<CartItem, "quantity">,
  quantity: number = 1
) {
  const safeQty = Math.max(1, Math.floor(quantity))
  const existing = store.items.find(
    (i) => i.id === item.id && i.variant === item.variant
  )

  if (existing) {
    store = {
      ...store,
      items: store.items.map((i) =>
        i.id === item.id && i.variant === item.variant
          ? { ...i, quantity: i.quantity + safeQty }
          : i
      ),
    }
  } else {
    store = {
      ...store,
      items: [...store.items, { ...item, quantity: safeQty }],
    }
  }
  emitChange()
}

export function removeFromCart(id: string, variant?: string) {
  store = {
    ...store,
    items: store.items.filter(
      (i) => !(i.id === id && i.variant === variant)
    ),
  }
  emitChange()
}

export function updateCartQuantity(
  id: string,
  variant: string | undefined,
  quantity: number
) {
  const safeQty = Math.floor(quantity)
  if (safeQty < 1) {
    removeFromCart(id, variant)
    return
  }
  store = {
    ...store,
    items: store.items.map((i) =>
      i.id === id && i.variant === variant
        ? { ...i, quantity: safeQty }
        : i
    ),
  }
  emitChange()
}

export function applyCoupon(code: string, discount: number) {
  store = { ...store, coupon: { code, discount } }
  emitChange()
}

export function removeCoupon() {
  store = { ...store, coupon: null }
  emitChange()
}

export function clearCart() {
  store = { items: [], coupon: null }
  emitChange()
}

export function useCart() {
  const cart = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const count = cart.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = cart.items.reduce(
    (sum, i) => sum + i.pricePKR * i.quantity,
    0
  )
  const discountAmount = cart.coupon
    ? Math.round(subtotal * (cart.coupon.discount / 100))
    : 0
  return {
    items: cart.items,
    coupon: cart.coupon,
    count,
    subtotal,
    discountAmount,
  }
}