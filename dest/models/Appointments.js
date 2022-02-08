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
const appointmentSchema = new mongoose_1.Schema({
    pet: { type: mongoose_1.default.Types.ObjectId, ref: "pets" },
    service: { type: String },
    appointmentDate: { type: Date },
    reason: { type: String },
    doctor: { type: mongoose_1.default.Types.ObjectId, ref: "staff" },
    user: { type: mongoose_1.default.Types.ObjectId, ref: "users" },
    medacin: { type: mongoose_1.default.Types.ObjectId, ref: "medicins" },
    report: { type: String, default: "" },
    status: { type: String },
    paymentStatus: { type: String, default: "Not Completed" },
    payment: { type: mongoose_1.default.Types.ObjectId, ref: "payments" },
    paymentType: { type: String },
    totalAmount: { type: Number },
    invoice: [{ type: mongoose_1.default.Types.ObjectId, ref: "invoices" }],
}, { timestamps: true });
const Appointments = mongoose_1.default.model("appointments", appointmentSchema);
exports.default = Appointments;
