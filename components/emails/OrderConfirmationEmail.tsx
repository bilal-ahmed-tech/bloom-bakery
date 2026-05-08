import * as React from "react"

type OrderItem = {
  name: string
  variant?: string | null
  quantity: number
  pricePKR: number
}

type Props = {
  customerName: string
  orderId: string
  items: OrderItem[]
  totalPKR: number
  type: "DELIVERY" | "PICKUP"
  timeSlot?: string | null
}

function formatPKR(amount: number) {
  return `PKR ${new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 0,
  }).format(amount)}`
}

export default function OrderConfirmationEmail({
  customerName,
  orderId,
  items,
  totalPKR,
  type,
  timeSlot,
}: Props) {
  return (
    <html>
      <body style={{ fontFamily: "Georgia, serif", backgroundColor: "#fdf8f3", margin: 0, padding: "40px 20px" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "16px", overflow: "hidden", border: "1px solid #f0e8e0" }}>
          
          {/* Header */}
          <div style={{ backgroundColor: "#f43f5e", padding: "32px 40px", textAlign: "center" }}>
            <h1 style={{ color: "#fdf8f3", margin: 0, fontSize: "28px", fontWeight: "600", letterSpacing: "0.05em" }}>
              Bloom Bakery
            </h1>
            <p style={{ color: "#fce7eb", margin: "8px 0 0", fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Order Confirmed
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: "40px" }}>
            <p style={{ fontSize: "16px", color: "#1c0a00", margin: "0 0 8px" }}>
              Hi <strong>{customerName}</strong>,
            </p>
            <p style={{ fontSize: "14px", color: "#7a6a60", margin: "0 0 32px", lineHeight: "1.6" }}>
              Thank you for your order! We have received it and will begin preparing it shortly.
            </p>

            {/* Order ID */}
            <div style={{ backgroundColor: "#fdf8f3", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", border: "1px solid #f0e8e0" }}>
              <p style={{ margin: 0, fontSize: "11px", color: "#7a6a60", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                Order ID
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "16px", fontWeight: "700", color: "#f59e0b", fontFamily: "monospace" }}>
                {orderId.slice(0, 8).toUpperCase()}
              </p>
            </div>

            {/* Order details */}
            <div style={{ backgroundColor: "#fdf8f3", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", border: "1px solid #f0e8e0" }}>
              <p style={{ margin: "0 0 12px", fontSize: "11px", color: "#7a6a60", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                Order Details
              </p>
              <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#1c0a00" }}>
                <strong>Type:</strong> {type === "DELIVERY" ? "Delivery" : "Pickup"}
              </p>
              {timeSlot && (
                <p style={{ margin: "0", fontSize: "13px", color: "#1c0a00" }}>
                  <strong>{type === "DELIVERY" ? "Delivery" : "Pickup"} Slot:</strong> {timeSlot}
                </p>
              )}
            </div>

            {/* Items */}
            <div style={{ marginBottom: "24px" }}>
              <p style={{ margin: "0 0 12px", fontSize: "11px", color: "#7a6a60", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                Items Ordered
              </p>
              {items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: i < items.length - 1 ? "1px solid #f0e8e0" : "none",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: "14px", color: "#1c0a00", fontWeight: "500" }}>
                      {item.name}
                    </p>
                    {item.variant && (
                      <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#7a6a60" }}>
                        {item.variant}
                      </p>
                    )}
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#7a6a60" }}>
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#1c0a00" }}>
                    {formatPKR(item.pricePKR * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px", backgroundColor: "#fce7eb", borderRadius: "12px", marginBottom: "32px" }}>
              <p style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#1c0a00" }}>
                Total
              </p>
              <p style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#f43f5e" }}>
                {formatPKR(totalPKR)}
              </p>
            </div>

            <p style={{ fontSize: "13px", color: "#7a6a60", lineHeight: "1.6", margin: "0 0 8px" }}>
              We will WhatsApp you when your order is out for {type === "DELIVERY" ? "delivery" : "pickup"}.
            </p>
            <p style={{ fontSize: "13px", color: "#7a6a60", lineHeight: "1.6", margin: 0 }}>
              If you have any questions, reply to this email or message us on WhatsApp.
            </p>
          </div>

          {/* Footer */}
          <div style={{ backgroundColor: "#1c0a00", padding: "24px 40px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#a08070" }}>
              Bloom Bakery — Freshly baked with love
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6a5a50" }}>
              Rahim Yar Khan, Pakistan
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}