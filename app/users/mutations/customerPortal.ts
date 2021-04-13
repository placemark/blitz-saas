import stripe, { env } from "integrations/stripe"
import { Ctx } from "blitz"
import db from "db"

interface CustomerPortalInput {}

// https://stripe.com/docs/billing/subscriptions/checkout#customer-portal
export default async function customerPortalInput(_input: CustomerPortalInput, ctx: Ctx) {
  ctx.session.$authorize()

  const user = await db.user.findFirst({
    where: { id: ctx.session.userId },
    select: { stripeCustomerId: true },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const portalsession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId as string,
    return_url: env.DOMAIN,
  })

  return {
    url: portalsession.url,
  }
}
