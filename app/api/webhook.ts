import getRawBody from "raw-body"
import db from "db"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import stripe, { Stripe, env } from "integrations/stripe"

// https://stripe.com/docs/billing/subscriptions/checkout#customer-portal
export default async function webhook(req: BlitzApiRequest, res: BlitzApiResponse) {
  if (req.method !== "POST") {
    res.status(400).end("POST method only")
  }

  const rawBody = await getRawBody(req, { limit: "2mb" })

  const signature = req.headers["stripe-signature"]
  let event: Stripe.Event

  try {
    if (typeof signature !== "string") {
      throw new Error("stripe-signature header missing or incorrect")
    }
    event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`)
    return res.status(400).end()
  }

  // Adopted from https://bit.ly/3mLMvnK
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      await db.user.update({
        where: { stripeCustomerId: session.customer as string },
        data: {
          subscriptionStatus: "active",
        },
      })
      break
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      await db.user.update({
        where: { stripeCustomerId: subscription.customer as string },
        data: {
          subscriptionStatus: subscription.status,
          price: subscription.items.data[0].price.id,
        },
      })
      break
    }
    default:
  }

  res.status(200).end()
}

// This API route needs the raw body, not something parsed.
export const config = {
  api: {
    bodyParser: false,
  },
}
