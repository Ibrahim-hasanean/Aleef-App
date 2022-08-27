"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelPayment = exports.paymentMethod = void 0;
// import Stripe from "stripe";
const Stripe = require("stripe");
require("dotenv").config();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2020-08-27",
    typescript: true,
});
const paymentMethod = (amount, currency, description, cardNumber, exp_month, exp_year, cvc) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let payment = await stripe.paymentIntents.create({
        //     amount: amount * 1000, currency, description, payment_method, confirm: true
        // });
        // let payment = await stripe.paymentIntents.create({
        //     amount: amount * 100, currency, description,
        // });
        const token = yield stripe.tokens.create({
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
    }
    catch (error) {
        console.log("error", error);
        return Promise.reject(`payment failed, ${error.message}`);
    }
});
exports.paymentMethod = paymentMethod;
const cancelPayment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payment = yield stripe.paymentIntents.cancel(id);
        return payment;
    }
    catch (error) {
        console.log("error", error);
        return Promise.reject(`cancel payment failed, ${error.message}`);
    }
});
exports.cancelPayment = cancelPayment;
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield stripe.tokens.create({
            card: {
                number: "4242424242424242",
                exp_month: 4,
                exp_year: 2023,
                cvc: "314",
            },
        });
        let stripeCharge = yield stripe.charges.create({
            amount: 15 * 100,
            currency: "usd",
            description: "paymennnttt",
            source: token.id,
        });
        console.log(token);
        console.log(stripeCharge);
    }
    catch (error) {
        console.log("error", error);
        return Promise.reject(`payment failed, ${error.message}`);
    }
});
// test();
