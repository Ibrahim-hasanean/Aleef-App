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
exports.cancelOrder = exports.getPaymentById = exports.getPayments = exports.payItem = void 0;
const OrderItems_1 = __importDefault(require("../../../models/OrderItems"));
const Order_1 = __importDefault(require("../../../models/Order"));
const calculateItemsPrice_1 = __importDefault(require("../../utils/calculateItemsPrice"));
const Payment_1 = __importDefault(require("../../../models/Payment"));
const mongoose_1 = __importDefault(require("mongoose"));
const paymentMethod_1 = require("../../utils/paymentMethod");
const payItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { totalPrice, itemsCount, shippingFees, shippingAddressId, orderItems, currency, paymentType, 
        // stripeToken,
        cardNumber, expMonth, expYear, cvc, cardHolderName } = req.body;
        const user = req.user;
        let orderItemsTotal;
        console.log({ paymentType });
        try {
            orderItemsTotal = yield (0, calculateItemsPrice_1.default)(orderItems);
        }
        catch (error) {
            return res.status(400).json({ status: 400, msg: error.message });
        }
        if (totalPrice != orderItemsTotal.totalCost) {
            return res.status(400).json({ status: 400, msg: "totalPrice not equal all items total price" });
        }
        if (shippingFees != orderItemsTotal.shippingCost) {
            return res.status(400).json({ status: 400, msg: "shippingFees not equal all items total shipping fees" });
        }
        if (paymentType === "card" && (!cardNumber || !expMonth || !expYear || !cvc || !cardHolderName)) {
            return res.status(400).json({ status: 400, msg: "cards info required for credit orders" });
        }
        const orderItemsCollection = yield OrderItems_1.default.create(...orderItems);
        const newOrder = new Order_1.default({
            user: user._id,
            totalPrice,
            itemsCount,
            items: orderItemsCollection,
            subTotal: totalPrice - shippingFees,
            shippingFees,
            shippingAddress: shippingAddressId,
            currency,
            status: "to be shipped",
            paymentType,
            cardHolderName,
            cardNumber
        });
        // online payment
        const payment = new Payment_1.default({
            totalAmount: totalPrice, paymentAmmount: totalPrice, paymentType: paymentType == "card" ? "visa" : paymentType, user: user._id, order: newOrder._id
        });
        if (paymentType == "card") {
            let paymentCharge = yield (0, paymentMethod_1.paymentMethod)(totalPrice, currency, `new order payment order id ${newOrder._id}`, cardNumber, expMonth, expYear, cvc);
            payment.paymentChargeId = paymentCharge.id;
            newOrder.payment = payment._id;
            newOrder.paymentChargeId = paymentCharge.id;
            yield payment.save();
        }
        yield newOrder.save();
        yield payment.save();
        return res.status(200).json({ status: 200, data: { order: newOrder } });
    }
    catch (error) {
        return res.status(400).json({ status: 400, msg: (_a = error.message) !== null && _a !== void 0 ? _a : error });
    }
});
exports.payItem = payItem;
const getPayments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { page, limit, status, from, to } = req.query;
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let user = req.user;
    let query = { user: user._id };
    if (status)
        query.status = status;
    if (from || to)
        query.createdAt = {};
    if (to) {
        let date = new Date(to);
        date.setHours(23);
        date.setMinutes(59);
        query.createdAt.$lte = date;
    }
    if (from)
        query.createdAt.$gte = new Date(from);
    console.log(query);
    let userOrders = yield Order_1.default
        .find(query)
        .sort({ createdAt: "desc" })
        .populate({ path: "items", populate: { path: "item" } })
        .skip(skip)
        .limit(limitNumber);
    return res.status(200).json({ status: 200, data: { orders: userOrders } });
});
exports.getPayments = getPayments;
const getPaymentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let paymentsId = req.params.id;
    if (!mongoose_1.default.isValidObjectId(paymentsId)) {
        return res.status(200).json({ status: 200, data: { order: null } });
    }
    let userOrders = yield Order_1.default.findById(paymentsId).populate({ path: "items", populate: { path: "item" } });
    return res.status(200).json({ status: 200, data: { order: userOrders } });
});
exports.getPaymentById = getPaymentById;
const cancelOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let paymentsId = req.params.id;
    // let { paymentChargeId } = req.body;
    if (!mongoose_1.default.isValidObjectId(paymentsId)) {
        return res.status(400).json({ status: 400, msg: "order not found" });
    }
    let userOrder = yield Order_1.default.findOne({ user: user._id, _id: paymentsId });
    if (!userOrder)
        return res.status(400).json({ status: 400, msg: "order not found" });
    if (userOrder.status == "shipped")
        return res.status(400).json({ status: 400, msg: "can not cancel order , order is shipped" });
    if (userOrder.paymentChargeId)
        yield (0, paymentMethod_1.cancelPayment)(userOrder.paymentChargeId);
    userOrder.status = "canceled";
    // if (paymentIntent) {
    //     await cancelPayment(paymentIntent)
    // }
    yield userOrder.save();
    return res.status(200).json({ status: 200, data: { order: userOrder } });
});
exports.cancelOrder = cancelOrder;
