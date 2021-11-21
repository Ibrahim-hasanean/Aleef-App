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
exports.getReminder = exports.getAppointmentPaymentById = exports.getAppointmentPayments = exports.payAppointment = exports.getAvaliableTime = exports.deleteAppointments = exports.getAppointmentsById = exports.getAppointments = exports.updateAppointment = exports.addAppointment = void 0;
const Appointments_1 = __importDefault(require("../../../models/Appointments"));
const getFreeTimes_1 = __importDefault(require("../../utils/getFreeTimes"));
const getFreeDoctors_1 = __importDefault(require("../../utils/getFreeDoctors"));
const isDateOutWorkTime_1 = __importDefault(require("../../utils/isDateOutWorkTime"));
const Payment_1 = __importDefault(require("../../../models/Payment"));
const mongoose_1 = __importDefault(require("mongoose"));
const addAppointment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { petId, service, appointmentDate, reason } = req.body;
    const user = req.user;
    const handleAppointmentDate = new Date(appointmentDate);
    handleAppointmentDate.setSeconds(0);
    handleAppointmentDate.setMilliseconds(0);
    const isAppointmentOutOfWorkHours = (0, isDateOutWorkTime_1.default)(handleAppointmentDate);
    if (isAppointmentOutOfWorkHours)
        return res.status(400).json({ status: 400, msg: "appointment date is out of work hours" });
    const freeDoctors = yield (0, getFreeDoctors_1.default)(appointmentDate, handleAppointmentDate);
    if (freeDoctors.length === 0)
        return res.status(409).json({ status: 409, msg: "there is no free doctors" });
    const newAppontment = yield Appointments_1.default.create({
        pet: petId,
        service,
        appointmentDate: handleAppointmentDate,
        reason,
        doctor: freeDoctors[0]._id,
        user: user._id,
    });
    return res.status(201).json({
        status: 201, msg: "appointment created successfully",
        data: { newAppontment }
    });
});
exports.addAppointment = addAppointment;
const updateAppointment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { petId, service, appointmentDate, reason, doctorId } = req.body;
    const user = req.user;
    let appointmentId = req.params.id;
    if (!mongoose_1.default.isValidObjectId(appointmentId)) {
        return res.status(400).json({ status: 400, msg: "appointment not  found" });
    }
    const appointment = yield Appointments_1.default.findById(appointmentId);
    if (!appointment)
        return res.status(400).json({ status: 400, msg: "apppointment not found" });
    const handleAppointmentDate = new Date(appointmentDate);
    handleAppointmentDate.setSeconds(0);
    handleAppointmentDate.setMilliseconds(0);
    const isAppointmentOutOfWorkHours = (0, isDateOutWorkTime_1.default)(handleAppointmentDate);
    if (isAppointmentOutOfWorkHours)
        return res.status(400).json({ status: 400, msg: "appointment date is out of work hours" });
    const freeDoctors = yield (0, getFreeDoctors_1.default)(appointmentDate, handleAppointmentDate);
    // if (isAppointmentDateHold.length > 0) {
    //     if (isAppointmentDateHold.length === 1 && String(isAppointmentDateHold[0]._id) != String(appointment._id))
    //         return res.status(409).json({ status: 409, msg: "new appointment date is conflict with other appointments" });
    //     if (isAppointmentDateHold.length > 1)
    //         return res.status(409).json({ status: 409, msg: "new appointment date is conflict with other appointments" });
    // }
    if (freeDoctors.length === 0)
        return res.status(409).json({ status: 409, msg: "there is no free doctors" });
    const newAppontment = yield Appointments_1.default.findByIdAndUpdate(appointmentId, {
        pet: petId,
        service,
        appointmentDate: handleAppointmentDate,
        reason,
        doctor: freeDoctors[0]._id,
        user: user._id,
    });
    return res.status(201).json({
        status: 201, msg: "appointment updated successfully", data: {
            appontment: newAppontment
        }
    });
});
exports.updateAppointment = updateAppointment;
const getAppointments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { page, pageSize, service, doctorId, paymentStatus, petId } = req.query;
    let numberPageSize = pageSize ? Number(pageSize) : 15;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let user = req.user;
    let query = { user: user._id };
    if (service)
        query.service = service;
    if (doctorId)
        query.doctor = doctorId;
    if (paymentStatus)
        query.paymentStatus = paymentStatus;
    if (petId)
        query.pet = petId;
    const appointments = yield Appointments_1.default.find(query)
        .populate("doctor")
        .populate("pet")
        .sort({ appointmentDate: "desc" })
        .skip(skip)
        .limit(numberPageSize);
    return res.status(200).json({ status: 200, data: { appointments } });
});
exports.getAppointments = getAppointments;
const getAppointmentsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let user = req.user;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return res.status(200).json({ status: 200, data: { appointment: null } });
    }
    const appointment = yield Appointments_1.default.findOne({ _id: id, user: user._id });
    return res.status(200).json({ status: 200, data: { appointment } });
});
exports.getAppointmentsById = getAppointmentsById;
const deleteAppointments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let user = req.user;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return res.status(200).json({ status: 200, msg: "appointment deleted successfully" });
    }
    const appointment = yield Appointments_1.default.findOneAndDelete({ _id: id, user: user._id });
    return res.status(200).json({ status: 200, msg: "appointment deleted successfully" });
});
exports.deleteAppointments = deleteAppointments;
const getAvaliableTime = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { day } = req.query;
    const handleAppointmentDate = new Date(day);
    handleAppointmentDate.setMinutes(0);
    handleAppointmentDate.setSeconds(0);
    handleAppointmentDate.setMilliseconds(0);
    const appointmentDates = yield (0, getFreeTimes_1.default)(handleAppointmentDate);
    return res.status(200).json({ status: 200, data: { appointmentDates } });
});
exports.getAvaliableTime = getAvaliableTime;
const payAppointment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { totalAmount, discount, paymentAmmount, exchange, appointmentId } = req.body;
    let user = req.user;
    const isAppointmentExist = yield Appointments_1.default.findById(appointmentId);
    if (!isAppointmentExist)
        return res.status(400).json({ status: 400, msg: `appointment with id ${appointmentId} not exist` });
    let newPayment = yield Payment_1.default.create({
        totalAmount,
        discount,
        paymentAmmount,
        exchange,
        paymentType: "visa",
        user: user._id,
        appointment: appointmentId
    });
    isAppointmentExist.payment = newPayment._id;
    isAppointmentExist.paymentStatus = "Completed";
    yield isAppointmentExist.save();
    return res.status(201).json({ status: 201, msg: "payment success", data: { payment: newPayment } });
});
exports.payAppointment = payAppointment;
const getAppointmentPayments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let query = { user: user._id };
    let payments = yield Payment_1.default.find(query);
    return res.status(200).json({ status: 200, data: { payments } });
});
exports.getAppointmentPayments = getAppointmentPayments;
const getAppointmentPaymentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let id = req.params.id;
    let query = { user: user._id, _id: id };
    let payment = yield Payment_1.default.findOne(query);
    return res.status(200).json({ status: 200, data: { payment } });
});
exports.getAppointmentPaymentById = getAppointmentPaymentById;
const getReminder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { page, limit } = req.query;
    let user = req.user;
    let numberPageSize = limit ? Number(limit) : 2;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let date = new Date();
    let appointments = yield Appointments_1.default.find({ appointmentDate: { $gte: date }, user: user._id }).skip(skip).limit(numberPageSize);
    return res.status(200).json({ status: 200, data: { appointments } });
});
exports.getReminder = getReminder;
