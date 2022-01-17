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
exports.adminHome = void 0;
const User_1 = __importDefault(require("../../../../models/User"));
const Appointments_1 = __importDefault(require("../../../../models/Appointments"));
const Order_1 = __importDefault(require("../../../../models/Order"));
const Payment_1 = __importDefault(require("../../../../models/Payment"));
const HealthCare_1 = __importDefault(require("../../../../models/HealthCare"));
const adminHome = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const totalClients = yield User_1.default.count();
    const totalAppointments = yield Appointments_1.default.count();
    const totalOrders = yield Order_1.default.count();
    let storeRevenueSum = yield Order_1.default.aggregate([{ $group: { _id: null, storeRevenue: { $sum: '$totalPrice' } } }]);
    let clinicRevenueSum = yield Payment_1.default.
        aggregate([
        { $match: { appointment: { $ne: null } } },
        { $group: { _id: null, clinicRevenue: { $sum: '$totalAmount' } } }
    ]);
    const storeRevenue = storeRevenueSum[0] ? storeRevenueSum[0].storeRevenue : 0;
    const clinicRevenue = clinicRevenueSum[0] ? clinicRevenueSum[0].clinicRevenue : 0;
    let newOrders = yield Order_1.default
        .find()
        .sort({ createdAt: "desc" })
        .populate({
        path: "items",
        populate: {
            path: "item",
            // match: { name: { "$regex": text || "", "$options": "i" } } 
        }
    })
        .populate({ path: "user", select: ['fullName', 'phoneNumber', 'email'] })
        .limit(10);
    let newAppointments = yield Appointments_1.default
        .find()
        .sort({ appointmentDate: "desc" })
        .populate({ path: "user", select: ['fullName', 'phoneNumber', 'email'] })
        .limit(10);
    const healthCare = yield HealthCare_1.default.find();
    return res.status(200).json({
        status: 200,
        data: {
            totalClients,
            totalAppointments,
            totalOrders,
            storeRevenue,
            clinicRevenue,
            totalRevenue: storeRevenue + clinicRevenue,
            healthCare: healthCare[0],
            newOrders,
            newAppointments,
        }
    });
});
exports.adminHome = adminHome;
