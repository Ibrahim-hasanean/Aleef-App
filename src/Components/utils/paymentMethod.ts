import Stripe from "stripe";
require("dotenv").config();
const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2020-08-27',
});

export const paymentMethod = async (amount: number, currency: string, description: string,) => {
    try {
        // let payment = await stripe.paymentIntents.create({
        //     amount: amount * 1000, currency, description, payment_method, confirm: true
        // });
        let payment = await stripe.paymentIntents.create({
            amount: amount * 100, currency, description,
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


const test = async () => {
    try {
        let payment = await stripe.paymentIntents.create({
            amount: 100 * 100, currency: "usd", description: "aleefaaa",
        });
        // payment_method: "pm_1Kr0pJIxwT72miO5XMaDB5MG", 
        console.log("paymentttt: ", payment)
        // const paymentIntent = await stripe.paymentIntents.confirm(
        //     payment.id,
        //     { payment_method: 'pm_1Kr0pJIxwT72miO5XMaDB5MG', setup_future_usage: "off_session" }
        // );
        // console.log("paymentIntent: ", paymentIntent)

    } catch (error: any) {
        console.log("error", error)
        return Promise.reject(`payment failed, ${error.message}`);
    }
}
// test()