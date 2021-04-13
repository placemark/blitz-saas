import Stripe from "stripe"
import { str, envsafe } from "envsafe"

export const env = envsafe({
  DOMAIN: str(),
  STRIPE_WEBHOOK_SECRET: str(),
  STRIPE_SECRET_KEY: str(),
})

export * from "stripe"

// Centrally configure an instance of the Stripe client
export default new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
})
