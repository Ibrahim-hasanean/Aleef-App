import Stripe from "stripe";
require("dotenv").config();
const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2020-08-27',
});

export const paymentMethod = async (token: string, amount: number, currency: string, description: string) => {
    try {
        // let payment = await stripe.paymentIntents.create({
        //     amount: amount * 1000, currency, description, payment_method, confirm: true
        // });
        // let payment = await stripe.paymentIntents.create({
        //     amount: amount * 100, currency, description,
        // });
        let stripeCharge = stripe.charges.create({
            amount: amount * 100, currency, description, source: token
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
        // const token = await stripe.tokens.create({
        //     card: {
        //         number: '4242424242424242',
        //         exp_month: 4,
        //         exp_year: 2023,
        //         cvc: '314',
        //     },
        // });
        // let stripeCharge = stripe.charges.create({
        //     amount: 50 * 100, currency: "usd", description: "paymennnttt", source: token.id
        // });
        // console.log(stripeCharge)

    } catch (error: any) {
        console.log("error", error)
        return Promise.reject(`payment failed, ${error.message}`);
    }
}
// test();
