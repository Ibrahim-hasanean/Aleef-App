import Stripe from "stripe";
require("dotenv").config();
const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY as string;
console.log("stripeSecretKeyyy", stripeSecretKey);
const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2020-08-27',
});

const paymentMethod = async () => {


}

export default paymentMethod;