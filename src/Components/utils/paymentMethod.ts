import Stripe from "stripe";
require("dotenv").config();
const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2020-08-27',
});

export const paymentMethod = async (amount: number, currency: string, description: string, payment_method: string) => {
    try {
        let payment = await stripe.paymentIntents.create({
            amount, currency, description, payment_method, confirm: true
        });
        return payment;

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
