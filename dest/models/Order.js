"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const orderSchema = new mongoose_1.Schema({
    totalPrice: { type: Number },
    itemsCount: { type: Number },
    paymentIntentId: { type: String },
    items: [{ type: mongoose_1.default.Types.ObjectId, ref: "orderItems" }],
    shippingFees: { type: Number },
    subTotal: { type: Number },
    shippingAddress: { type: mongoose_1.default.Types.ObjectId, ref: "addresses" },
    cardNumber: { type: String },
    cardHolderName: { type: String },
    ExperitionDate: { type: String },
    SecurityCode: { type: String },
    user: { type: mongoose_1.default.Types.ObjectId, ref: "users", required: true },
    status: { type: String },
    currency: { type: String },
    payment: { type: mongoose_1.default.Types.ObjectId, ref: "payments" },
}, { timestamps: true });
const Order = mongoose_1.default.model("orders", orderSchema);
exports.default = Order;
