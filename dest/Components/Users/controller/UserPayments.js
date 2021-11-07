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
exports.getPaymentById = exports.getPayments = exports.payItem = void 0;
const OrderItems_1 = __importDefault(require("../../../models/OrderItems"));
const Order_1 = __importDefault(require("../../../models/Order"));
const calculateItemsPrice_1 = __importDefault(require("../../utils/calculateItemsPrice"));
const payItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { totalPrice, itemsCount, shippingFees, shippingAddressId, cardNumber, orderItems } = req.body;
    const user = req.user;
    const orderItemsTotal = yield (0, calculateItemsPrice_1.default)(orderItems);
    console.log(totalPrice);
    console.log(orderItemsTotal);
    if (totalPrice != orderItemsTotal.totalCost) {
        return res.status(400).json({ status: 400, msg: "totalPrice not equal all items total price" });
    }
    if (shippingFees != orderItemsTotal.shippingCost) {
        return res.status(400).json({ status: 400, msg: "shippingFees not equal all items total shipping fees" });
    }
    //payment 
    const orderItemsCollection = yield OrderItems_1.default.create(...orderItems);
    const newOrder = yield Order_1.default.create({ user: user._id, totalPrice, itemsCount, items: orderItemsCollection, shippingFees, shippingAddress: shippingAddressId, cardNumber });
    return res.status(200).json({ status: 200, data: { order: newOrder } });
});
exports.payItem = payItem;
const getPayments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let userOrders = yield Order_1.default.find({ user: user._id }).populate({ path: "items", populate: { path: "item" } });
    return res.status(200).json({ status: 200, data: { orders: userOrders } });
});
exports.getPayments = getPayments;
const getPaymentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let paymentsId = req.params.id;
    let userOrders = yield Order_1.default.findById(paymentsId).populate({ path: "items", populate: { path: "item" } });
    return res.status(200).json({ status: 200, data: { order: userOrders } });
});
exports.getPaymentById = getPaymentById;
