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
exports.updateOrder = exports.addOrder = exports.deleteOrder = exports.setStatus = exports.getOrderById = exports.getOrders = void 0;
const Order_1 = __importDefault(require("../../../../models/Order"));
const Payment_1 = __importDefault(require("../../../../models/Payment"));
const calculateItemsPrice_1 = __importDefault(require("../../../utils/calculateItemsPrice"));
const OrderItems_1 = __importDefault(require("../../../../models/OrderItems"));
const User_1 = __importDefault(require("../../../../models/User"));
const Item_1 = __importDefault(require("../../../../models/Item"));
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { status, from, to, page, limit, text } = req.query;
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let query = {};
    if (from || to) {
        query.createdAt = {};
    }
    if (from) {
        const handleFromDate = new Date(from);
        handleFromDate.setSeconds(0);
        handleFromDate.setMilliseconds(0);
        handleFromDate.setMinutes(0);
        handleFromDate.setHours(1);
        query = Object.assign(Object.assign({}, query), { createdAt: { $gte: handleFromDate } });
    }
    if (to) {
        const handleToDate = new Date(to);
        handleToDate.setSeconds(0);
        handleToDate.setMilliseconds(0);
        handleToDate.setMinutes(59);
        handleToDate.setHours(23);
        query = Object.assign(Object.assign({}, query), { createdAt: Object.assign(Object.assign({}, query.createdAt), { $lte: handleToDate }) });
    }
    if (status)
        query.status = status;
    if (text) {
        // query = { ...query, "user.fullName": { "$regex": text || "", "$options": "i" } };
        const users = yield User_1.default.find({ fullName: { "$regex": text, "$options": "i" } }).select("_id");
        const usersId = users.map(x => x._id);
        const items = yield Item_1.default.find({ name: { "$regex": text, "$options": "i" } });
        const itemsId = items.map(x => x._id);
        const ordersItems = yield OrderItems_1.default.find({ item: { $in: itemsId } }).select("_id");
        const ordersItemsId = ordersItems.map(x => x._id);
        query = Object.assign(Object.assign({}, query), { $or: [{ user: { $in: usersId } }, { items: { $in: ordersItemsId } }] });
    }
    let orders = yield Order_1.default
        .find(query)
        .sort({ createdAt: "desc" })
        .populate({
        path: "items",
        populate: {
            path: "item",
            // match: { name: { "$regex": text || "", "$options": "i" } } 
        }
    })
        .populate({ path: "user", select: ['fullName', 'phoneNumber', 'email'] })
        .skip(skip)
        .limit(limitNumber)
        .exec();
    return res.status(200).json({ status: 200, data: { orders } });
});
exports.getOrders = getOrders;
const getOrderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let order = yield Order_1.default.findById(id).populate({ path: "items", populate: "item" }).populate({ path: "user", select: ['fullName', 'phoneNumber', 'email'] });
    return res.status(200).json({ status: 200, data: { order } });
});
exports.getOrderById = getOrderById;
const setStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { status } = req.body;
    let id = req.params.id;
    let order = yield Order_1.default.findByIdAndUpdate(id, { status });
    return res.status(200).json({ status: 200, data: { order } });
});
exports.setStatus = setStatus;
const deleteOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let order = yield Order_1.default.findByIdAndDelete(id);
    return res.status(200).json({ status: 200, data: { order } });
});
exports.deleteOrder = deleteOrder;
const addOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { totalPrice, itemsCount, shippingFees, shippingAddressId, cardNumber, orderItems, userId, status } = req.body;
    let orderItemsTotal;
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
    //payment 
    const orderItemsCollection = yield OrderItems_1.default.create(...orderItems);
    const newOrder = new Order_1.default({
        user: userId,
        totalPrice,
        itemsCount,
        subTotal: totalPrice - shippingFees,
        items: orderItemsCollection,
        shippingFees,
        shippingAddress: shippingAddressId,
        cardNumber,
        status: status ? status : "pending"
    });
    const payment = new Payment_1.default({ totalAmount: totalPrice, paymentAmmount: totalPrice, paymentType: "cash", user: userId, order: newOrder._id });
    newOrder.payment = payment._id;
    yield newOrder.save();
    yield payment.save();
    return res.status(200).json({ status: 200, data: { order: newOrder } });
});
exports.addOrder = addOrder;
const updateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { totalPrice, itemsCount, shippingFees, shippingAddressId, cardNumber, orderItems, userId } = req.body;
    let id = req.params.id;
    const orderItemsTotal = yield (0, calculateItemsPrice_1.default)(orderItems);
    if (totalPrice != orderItemsTotal.totalCost) {
        return res.status(400).json({ status: 400, msg: "totalPrice not equal all items total price" });
    }
    if (shippingFees != orderItemsTotal.shippingCost) {
        return res.status(400).json({ status: 400, msg: "shippingFees not equal all items total shipping fees" });
    }
    //payment 
    const orderItemsCollection = yield OrderItems_1.default.create(...orderItems);
    const newOrder = yield Order_1.default
        .findByIdAndUpdate(id, {
        user: userId,
        totalPrice,
        itemsCount,
        items: orderItemsCollection,
        shippingFees,
        shippingAddress: shippingAddressId,
        cardNumber,
        subTotal: totalPrice - shippingFees,
    });
    // const payment: PaymentInterFace = new Payment({ totalAmount: totalPrice, paymentAmmount: totalPrice, paymentType: "cash", user: userId, order: newOrder._id })
    // newOrder.payment = payment._id;
    // await newOrder.save();
    // await payment.save();
    return res.status(200).json({ status: 200, data: { order: newOrder } });
});
exports.updateOrder = updateOrder;
