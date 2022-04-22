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
exports.createPaymentIntent = void 0;
const Payment_1 = __importDefault(require("../../../models/Payment"));
const paymentMethod_1 = require("../../utils/paymentMethod");
const createPaymentIntent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { totalPrice, currency } = req.body;
        let user = req.user;
        let paymentIntent = yield (0, paymentMethod_1.paymentMethod)(totalPrice, currency, "aleef payment");
        const payment = yield Payment_1.default.create({
            totalAmount: totalPrice,
            paymentAmmount: totalPrice,
            paymentType: "visa",
            user: user._id,
            paymentIntentId: paymentIntent.id
        });
        return res.status(200).json({ status: 200, data: { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id } });
    }
    catch (error) {
        return res.status(400).json({ status: 400, msg: (_a = error.message) !== null && _a !== void 0 ? _a : error });
    }
});
exports.createPaymentIntent = createPaymentIntent;
