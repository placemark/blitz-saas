import stripe, { env } from "integrations/stripe"
import { Ctx } from "blitz"
import db from "db"

type CreateCheckoutSessionInput = {
  priceId: string
}

// Step 4: Create a Checkout Session
// https://stripe.com/docs/billing/subscriptions/checkout#create-session
export default async function createCheckoutSession(
  { priceId }: CreateCheckoutSessionInput,
  ctx: Ctx
) {
  ctx.session.$authorize()

  const user = await db.user.findFirst({
    where: { id: ctx.session.userId },
    select: { email: true, stripeCustomerId: true },
  })

  if (!user) {
    throw new Error("User not found")
  }

  const customer = await stripe.customers.create({
    email: user.email,
  })

  await db.user.update({
    where: { id: ctx.session.userId },
    data: {
      stripeCustomerId: customer.id,
    },
  })

  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: 30,
    },
    success_url: `${env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.DOMAIN}/cancelled`,
  })

  return {
    sessionId: session.id,
  }
}
