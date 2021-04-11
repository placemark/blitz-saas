import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw Error("Missing STRIPE_SECRET_KEY environent variable")
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw Error("Missing STRIPE_WEBHOOK_SECRET environent variable")
}

if (!process.env.DOMAIN) {
  throw new Error("Missing DOMAIN environment variable")
}

export * from "stripe"

// Centrally configure an instance of the Stripe client
export default new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
})

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
export const DOMAIN = process.env.DOMAIN
