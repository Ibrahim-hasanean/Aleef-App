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
exports.getAvaliableDoctrs = exports.getAvaliableTime = exports.deleteAppointments = exports.getAppointmentsById = exports.getAppointments = exports.updateAppointment = exports.addAppointment = void 0;
const Appointments_1 = __importDefault(require("../../../../models/Appointments"));
const getFreeTimes_1 = __importDefault(require("../../../utils/getFreeTimes"));
const getFreeDoctors_1 = __importDefault(require("../../../utils/getFreeDoctors"));
const isDateOutWorkTime_1 = __importDefault(require("../../../utils/isDateOutWorkTime"));
const Pets_1 = __importDefault(require("../../../../models/Pets"));
const User_1 = __importDefault(require("../../../../models/User"));
const addAppointment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { petId, service, appointmentDate, reason, userId, doctorId } = req.body;
    let isPetExist = yield Pets_1.default.findOne({ _id: petId, user: userId });
    if (!isPetExist)
        return res.status(400).json({ status: 400, msg: `pet with id ${petId} not exist` });
    let isUserExist = yield User_1.default.findById(userId);
    if (!isUserExist)
        return res.status(400).json({ status: 400, msg: `user with id ${userId} not exist` });
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
        doctor: doctorId || freeDoctors[0]._id,
        user: userId,
    });
    return res.status(201).json({
        status: 201, msg: "appointment created successfully",
        data: { newAppontment }
    });
});
exports.addAppointment = addAppointment;
const updateAppointment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { petId, service, appointmentDate, reason, doctorId, userId } = req.body;
    let appointmentId = req.params.id;
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
    if (freeDoctors.length === 0)
        return res.status(409).json({ status: 409, msg: "there is no free doctors" });
    const newAppontment = yield Appointments_1.default.findByIdAndUpdate(appointmentId, {
        pet: petId,
        service,
        appointmentDate: handleAppointmentDate,
        reason,
        doctor: doctorId || freeDoctors[0]._id,
        user: userId,
    });
    return res.status(201).json({
        status: 201, msg: "appointment updated successfully", data: {
            appontment: newAppontment
        }
    });
});
exports.updateAppointment = updateAppointment;
const getAppointments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { page, pageSize, service, doctorId, userId, paymentStatus, petId } = req.query;
    let numberPageSize = pageSize ? Number(pageSize) : 15;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let query = {};
    if (service)
        query.service = service;
    if (userId)
        query.user = userId;
    if (doctorId)
        query.doctor = doctorId;
    if (petId)
        query.pet = petId;
    if (paymentStatus)
        query.paymentStatus = paymentStatus;
    const appointments = yield Appointments_1.default.find(query)
        .sort({ appointmentDate: "desc" })
        .skip(skip)
        .limit(numberPageSize)
        .populate({ path: "doctor", select: ['name', 'phoneNumber', 'email', 'role'] })
        .populate({ path: "pet" })
        .populate({ path: "user", select: ['fullName', 'phoneNumber', 'email'] });
    return res.status(200).json({ status: 200, data: { appointments } });
});
exports.getAppointments = getAppointments;
const getAppointmentsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    const appointment = yield Appointments_1.default.findById(id)
        .populate({ path: "doctor", select: ['name', 'phoneNumber', 'email', 'role'] })
        .populate({ path: "pet" })
        .populate({ path: "user", select: ['fullName', 'phoneNumber', 'email'] });
    return res.status(200).json({ status: 200, data: { appointment } });
});
exports.getAppointmentsById = getAppointmentsById;
const deleteAppointments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    const appointment = yield Appointments_1.default.findByIdAndDelete(id);
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
const getAvaliableDoctrs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { date } = req.query;
    const handleAppointmentDate = new Date(date);
    handleAppointmentDate.setSeconds(0);
    handleAppointmentDate.setMilliseconds(0);
    let freeDoctors = yield (0, getFreeDoctors_1.default)(date, handleAppointmentDate);
    return res.status(200).json({ status: 200, data: { doctors: freeDoctors } });
});
exports.getAvaliableDoctrs = getAvaliableDoctrs;
