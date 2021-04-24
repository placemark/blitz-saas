import Stripe from "stripe"
import { str, envsafe } from "envsafe"
import { User } from "db"

export const env = envsafe({
  DOMAIN: str(),
  STRIPE_WEBHOOK_SECRET: str(),
  STRIPE_SECRET_KEY: str(),
})

// https://stackoverflow.com/questions/59903956/how-to-use-stripe-types-in-typescript

const getStripeSecretKey = (): string => {
  const secretKey = env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error("Stripe secret key not found in variable 'env.STRIPE_SECRET_KEY'")
  }
  return secretKey
}

const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: "2020-08-27",
  typescript: true,
  maxNetworkRetries: 2,
})

export const getPrice = async (id: string, expand?: ["product"]) => {
  const price = await stripe.prices
    .retrieve(id, { expand })
    .then((price) => price)
    .catch((err) => {
      console.log(err)
    })
  if (!price) {
    // handle case when price is void
  } else {
    // Perform Additional checks here using price's data and throw any errors:
    // such as checking if price.active is false
  }
  return price
}

export const getProduct = async (id: string) => {
  const product = await stripe.products
    .retrieve(id)
    .then((product) => product)
    .catch((err) => {
      console.log(err)
    })
  return product
}

export const createStripeCustomer = async (user_id: User["id"], email: string) => {
  const customer = await stripe.customers
    .create({
      email,
      description: "Created via Word Anthakshari app",
      ...setUserIdMetaData({ user_id }),
    })
    .then((customer) => customer.id)
    .catch((err) => console.log(err))

  return customer
}

// https://stripe.com/docs/payments/accept-a-payment?integration=checkout&ui=elements
export const createPaymentIntent = async (
  amount: number,
  currency: string,
  user_id: User["id"],
  customer: string,
  orderId: number
) => {
  const paymentIntentData: Stripe.PaymentIntentCreateParams = {
    amount,
    currency,
    customer,
    metadata: {
      user_id,
      order_id: orderId,
    },
  }
  var error: string = ""
  const clientSecret = await stripe.paymentIntents
    .create(paymentIntentData)
    .then((intent) => intent.client_secret)
    .catch((err) => (error = err.message))
  return { clientSecret, error: error.length > 0 ? error : null }
}

interface userIdMetaData {
  user_id: User["id"]
}
const setUserIdMetaData = ({ user_id }: userIdMetaData) => ({ metadata: { user_id } })

export default stripe
