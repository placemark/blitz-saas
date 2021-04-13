import stripe from "integrations/stripe"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"

// https://stripe.com/docs/billing/subscriptions/checkout#customer-portal
export default async function checkoutSession(req: BlitzApiRequest, res: BlitzApiResponse) {
  const { sessionId } = req.query

  try {
    if (Array.isArray(sessionId)) {
      throw new Error("only one sessionId parameter allowed")
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    res.send(session)
  } catch (e) {
    res.status(400)
    return res.send({
      error: {
        message: e.message,
      },
    })
  }
}
