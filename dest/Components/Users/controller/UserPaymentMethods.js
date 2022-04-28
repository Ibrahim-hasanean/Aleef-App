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
exports.createPaymentIntent = void 0;
const createPaymentIntent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // const { totalPrice, currency } = req.body;
        // let user = req.user;
        // let paymentIntent = await paymentMethod(totalPrice, currency, "aleef payment");
        // const payment: PaymentInterFace = await Payment.create({
        //     totalAmount: totalPrice,
        //     paymentAmmount: totalPrice,
        //     paymentType: "visa",
        //     user: user._id,
        //     paymentIntentId: paymentIntent.id
        // });
        // return res.status(200).json({ status: 200, data: { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id } });
    }
    catch (error) {
        return res.status(400).json({ status: 400, msg: (_a = error.message) !== null && _a !== void 0 ? _a : error });
    }
});
exports.createPaymentIntent = createPaymentIntent;
