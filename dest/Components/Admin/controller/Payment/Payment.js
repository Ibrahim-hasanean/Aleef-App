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
exports.deletePayment = exports.getPaymentById = exports.getPayments = exports.updatePayment = exports.addPayment = void 0;
const Payment_1 = __importDefault(require("../../../../models/Payment"));
const User_1 = __importDefault(require("../../../../models/User"));
const addPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { totalAmount, discount, paymentAmmount, exchange, paymentType, userId } = req.body;
    const isUserExist = yield User_1.default.findById(userId);
    if (!isUserExist)
        return res.status(400).json({ status: 400, msg: `user with userId ${userId} not found` });
    let newPayment = yield Payment_1.default.create({ totalAmount, discount, paymentAmmount, exchange, paymentType, user: userId });
    return res.status(201).json({ status: 201, msg: "payment success", data: { payment: newPayment } });
});
exports.addPayment = addPayment;
const updatePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params;
    let { totalAmount, discount, paymentAmmount, exchange, paymentType, userId } = req.body;
    const isUserExist = yield User_1.default.findById(userId);
    if (!isUserExist)
        return res.status(400).json({ status: 400, msg: `user with userId ${userId} not found` });
    let newPayment = yield Payment_1.default.findByIdAndUpdate(id, { totalAmount, discount, paymentAmmount, exchange, paymentType, user: userId });
    return res.status(201).json({ status: 201, msg: "payment success", data: { payment: newPayment } });
});
exports.updatePayment = updatePayment;
const getPayments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { page, pageSize, userId, paymentType } = req.query;
    let query = {};
    let numberPageSize = pageSize ? Number(pageSize) : 15;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    if (userId)
        query.user = userId;
    if (paymentType)
        query.paymentType = paymentType;
    let payments = yield Payment_1.default.find(query).skip(skip).limit(numberPageSize).populate("user");
    return res.status(200).json({ status: 200, data: { payments } });
});
exports.getPayments = getPayments;
const getPaymentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let payment = yield Payment_1.default.findById(id).populate("user");
    return res.status(200).json({ status: 200, data: { payment } });
});
exports.getPaymentById = getPaymentById;
const deletePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let payment = yield Payment_1.default.findByIdAndDelete(id);
    return res.status(200).json({ status: 200, data: { payment } });
});
exports.deletePayment = deletePayment;
