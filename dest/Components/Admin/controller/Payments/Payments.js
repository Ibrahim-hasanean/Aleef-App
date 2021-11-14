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
exports.getPaymentById = exports.getPayments = void 0;
const Payment_1 = __importDefault(require("../../../../models/Payment"));
const User_1 = __importDefault(require("../../../../models/User"));
const getPayments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { page, limit, paymentType, text, from, to } = req.query;
    let query = {};
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    if (paymentType)
        query.paymentType = paymentType;
    if (text) {
        const users = yield User_1.default.find({ fullName: { "$regex": text, "$options": "i" } }).select("_id");
        const usersId = users.map(x => x._id);
        query = Object.assign(Object.assign({}, query), { user: { $in: usersId } });
    }
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
    let payments = yield Payment_1.default.find(query).skip(skip).limit(limitNumber).populate("user");
    return res.status(200).json({ status: 200, data: { payments } });
});
exports.getPayments = getPayments;
const getPaymentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let payment = yield Payment_1.default.findById(id);
    return res.status(200).json({ status: 200, data: { payment } });
});
exports.getPaymentById = getPaymentById;
