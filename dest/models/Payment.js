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
const payemntSchema = new mongoose_1.Schema({
    paymentIntentId: { type: String },
    totalAmount: { type: Number, required: true },
    discount: { type: Number },
    paymentNumber: { type: Number },
    paymentAmmount: { type: Number, required: true },
    exchange: { type: Number },
    paymentType: { type: String, required: true },
    user: { type: mongoose_1.default.Types.ObjectId, ref: "users" },
    appointment: { type: mongoose_1.default.Types.ObjectId, ref: "appointments" },
    order: { type: mongoose_1.default.Types.ObjectId, ref: "orders" }
}, { timestamps: true });
payemntSchema.pre("save", function () {
    let payment = this;
    let generatedId = Date.now();
    payment.paymentNumber = generatedId;
});
const Payment = mongoose_1.default.model("payments", payemntSchema);
exports.default = Payment;
