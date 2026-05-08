// app/api/stripe/payment-intent/route.ts
// Creates a Stripe PaymentIntent for the given amount in USD cents.

import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { auth } from "@/auth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amountUSD } = await req.json()

    if (!amountUSD || amountUSD <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Stripe requires amount in cents
    const amountCents = Math.round(amountUSD * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      metadata: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error("[payment-intent]", err)
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    )
  }
}