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
exports.getInvoicements = exports.addInvoice = void 0;
const Invoice_1 = __importDefault(require("../../../../models/Invoice"));
const Appointments_1 = __importDefault(require("../../../../models/Appointments"));
const addInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { paymentAmount, reason, appointmentId, userId } = req.body;
    let doctor = req.staff;
    let isAppointmentExist = yield Appointments_1.default.findOne({ _id: appointmentId, user: userId });
    if (!isAppointmentExist) {
        return res.status(400).json({ status: 400, msg: `appointment with id ${appointmentId} not exist` });
    }
    let addInvoice = yield Invoice_1.default.create({
        paymentAmount,
        reason,
        appointment: appointmentId,
        user: userId,
        addedBy: doctor._id
    });
    isAppointmentExist.invoice = [...isAppointmentExist.invoice, addInvoice._id];
    yield isAppointmentExist.save();
    return res.status(201).json({ status: 201, msg: "invoice added successfully" });
});
exports.addInvoice = addInvoice;
const getInvoicements = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let staffMemeber = req.staff;
    let { appointmentId } = req.query;
    let query = {};
    if (appointmentId)
        query.appointment = appointmentId;
    let invoices = yield Invoice_1.default
        .find(query)
        .populate({ path: "appointment", select: ['appointmentDate', 'reason', 'status'] })
        .populate({ path: "user", select: ['fullName', 'phoneNumber'] })
        .populate({ path: "addedBy", select: ['email', 'phoneNumber', 'name'] });
    return res.status(200).json({ status: 200, data: { invoices } });
});
exports.getInvoicements = getInvoicements;
