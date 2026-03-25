import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (stripeClient) {
    return stripeClient;
  }

  const secret = process.env.STRIPE_SECRET_KEY;

  if (!secret) {
    return null;
  }

  stripeClient = new Stripe(secret);
  return stripeClient;
}

