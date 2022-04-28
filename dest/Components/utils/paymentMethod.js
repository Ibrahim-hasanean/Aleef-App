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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelPayment = exports.paymentMethod = void 0;
const stripe_1 = __importDefault(require("stripe"));
require("dotenv").config();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new stripe_1.default(stripeSecretKey, {
    apiVersion: '2020-08-27',
});
const paymentMethod = (token, amount, currency, description) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        console.log("error", error);
        return Promise.reject(`payment failed, ${error.message}`);
    }
});
// test();
