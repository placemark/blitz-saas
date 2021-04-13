## blitz-saas

This is an example of a Blitz app with subscription payments, with Stripe. Many
people need to implement this sort of thing, and this is an attempt to decide on
some tried-and-true patterns.

Because this touches finance, I reemphasize the **no guarantees** part of the
BSD license family: this code is free for adaptation and research, without
guarantees.

## Setup

This is a Blitz app, so all of the setup for that applies to this, setting up
Node, etc. So these directions are on top of that.

## Subscriptions with Checkout

This aims at supporting Stripe subscriptions with checkout, roughly following
the plot of [Subscriptions with Checkout](https://stripe.com/docs/billing/subscriptions/checkout),
the Stripe tutorial, but with the endpoints adapted to Blitz's capabilities.

### Environment

It's expected that you have a Stripe account, which is where you'll get most of
the required environment variables. These will, initially, go in `.env.local`
because these are either different from computer to computer, or are secrets.

```
# From the Stripe dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=sk_test_...

# From Products > (Your product) > Pricing
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...

# During testing, you can copy this from the Stripe CLI.
# In production, from your dashboard.
STRIPE_WEBHOOK_SECRET=...

# The domain of your server, so that Stripe
# can redirect to it.
DOMAIN=http://localhost:3000
```

Use the [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks while running this locally:

```
$ stripe listen --forward-to localhost:3000/api/webhook
```

---

This is free and open source. I greatly appreciate reviews, PRs, and contributions:
if you use it and it 'just works', consider [supporting me over on ko-fi](https://ko-fi.com/macwright).
