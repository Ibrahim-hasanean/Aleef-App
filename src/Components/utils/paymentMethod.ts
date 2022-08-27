// import Stripe from "stripe";
const Stripe = require("stripe");
require("dotenv").config();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2020-08-27",
  typescript: true,
});

export const paymentMethod = async (
  amount: number,
  currency: string,
  description: string,
  cardNumber: string,
  exp_month: number,
  exp_year: number,
  cvc: string
) => {
  try {
    // let payment = await stripe.paymentIntents.create({
    //     amount: amount * 1000, currency, description, payment_method, confirm: true
    // });
    // let payment = await stripe.paymentIntents.create({
    //     amount: amount * 100, currency, description,
    // });
    const token = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month,
        exp_year,
        cvc,
      },
    });
    let stripeCharge = stripe.charges.create({
      amount: amount * 100, currency, description, source: token.id
    });
    return stripeCharge;

  } catch (error: any) {
    console.log("error", error)
    return Promise.reject(`payment failed, ${error.message}`);
  }
}

export const cancelPayment = async (id: string) => {
  try {
    let payment = await stripe.paymentIntents.cancel(id);
    return payment;
  } catch (error: any) {
    console.log("error", error)
    return Promise.reject(`cancel payment failed, ${error.message}`);
  }
}

const test = async () => {
  try {
    const token = await stripe.tokens.create({
      card: {
        number: "4242424242424242",
        exp_month: 4,
        exp_year: 2023,
        cvc: "314",
      },
    });
    let stripeCharge = await stripe.charges.create({
      amount: 15 * 100,
      currency: "usd",
      description: "paymennnttt",
      source: token.id,
    });
    console.log(token);
    console.log(stripeCharge);
  } catch (error: any) {
    console.log("error", error);
    return Promise.reject(`payment failed, ${error.message}`);
  }
};
// test();
