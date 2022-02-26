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
exports.deleteReportToAppointment = exports.addReportToAppointment = exports.userAppointments = exports.getAvaliableDoctrs = exports.getAvaliableTime = exports.deleteAppointments = exports.getAppointmentsById = exports.getAppointments = exports.updateAppointment = exports.addAppointment = void 0;
const Appointments_1 = __importDefault(require("../../../../models/Appointments"));
const getFreeTimes_1 = __importDefault(require("../../../utils/getFreeTimes"));
const getFreeDoctors_1 = __importDefault(require("../../../utils/getFreeDoctors"));
const isDateOutWorkTime_1 = __importDefault(require("../../../utils/isDateOutWorkTime"));
const Pets_1 = __importDefault(require("../../../../models/Pets"));
const User_1 = __importDefault(require("../../../../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const addAppointment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { petId, service, appointmentDate, reason, userId, doctorId, report } = req.body;
    let isPetExist = yield Pets_1.default.findOne({ _id: petId, user: userId });
    if (!isPetExist)
        return res.status(400).json({ status: 400, msg: `pet with id ${petId} not exist` });
    let isUserExist = yield User_1.default.findById(userId);
    if (!isUserExist)
        return res.status(400).json({ status: 400, msg: `user with id ${userId} not exist` });
    const handleAppointmentDate = new Date(appointmentDate);
    handleAppointmentDate.setSeconds(0);
    handleAppointmentDate.setMilliseconds(0);
    // const isAppointmentOutOfWorkHours: boolean = isDateOutWorkTime(handleAppointmentDate);
    // if (isAppointmentOutOfWorkHours) return res.status(400).json({ status: 400, msg: "appointment date is out of work hours" });
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
        report
    });
    isPetExist.appointments = [...isPetExist.appointments, newAppontment._id];
    yield isPetExist.save();
    return res.status(201).json({
        status: 201, msg: "appointment created successfully",
        data: { newAppontment }
    });
});
exports.addAppointment = addAppointment;
const updateAppointment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { petId, service, appointmentDate, reason, doctorId, userId, report } = req.body;
    let appointmentId = req.params.id;
    if (!mongoose_1.default.isValidObjectId(appointmentId))
        return res.status(400).json({ status: 400, msg: `appointmentId ${appointmentId} not valid` });
    if (!mongoose_1.default.isValidObjectId(petId))
        return res.status(400).json({ status: 400, msg: `petId ${petId} not valid` });
    if (!mongoose_1.default.isValidObjectId(userId))
        return res.status(400).json({ status: 400, msg: `userId ${userId} not valid` });
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
        report
    });
    return res.status(201).json({
        status: 201, msg: "appointment updated successfully", data: {
            appontment: newAppontment
        }
    });
});
exports.updateAppointment = updateAppointment;
const getAppointments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page, pageSize, service, doctorId, userId, paymentStatus, petId, day, status } = req.query;
        let numberPageSize = pageSize ? Number(pageSize) : 15;
        let skip = (Number(page || 1) - 1) * numberPageSize;
        let query = {};
        if (service)
            query.service = service;
        if (userId && mongoose_1.default.isValidObjectId(userId))
            query.user = userId;
        else if (userId)
            return res.status(400).json({ status: 400, msg: `userId ${userId} not valid` });
        if (doctorId && mongoose_1.default.isValidObjectId(doctorId))
            query.doctor = doctorId;
        else if (doctorId)
            return res.status(400).json({ status: 400, msg: `doctorId ${doctorId} not valid` });
        if (petId && mongoose_1.default.isValidObjectId(petId))
            query.pet = petId;
        else if (petId)
            return res.status(400).json({ status: 400, msg: `petId ${petId} not valid` });
        if (paymentStatus)
            query.paymentStatus = paymentStatus;
        if (day) {
            let beginDay = new Date(day);
            beginDay.setUTCHours(0);
            beginDay.setMinutes(0);
            beginDay.setUTCMilliseconds(0);
            let endDay = new Date(day);
            endDay.setUTCHours(24);
            endDay.setMinutes(0);
            endDay.setUTCMilliseconds(0);
            query.appointmentDate = { $gte: beginDay, $lte: endDay };
            console.log(query);
        }
        if (status)
            query.status = status;
        const appointments = yield Appointments_1.default.find(query)
            .sort({ appointmentDate: "desc" })
            .skip(skip)
            .limit(numberPageSize)
            .populate({ path: "doctor", select: ['name', 'phoneNumber', 'email', 'role'] })
            .populate({ path: "pet", select: ['name', 'serialNumber', 'age'] })
            .populate({ path: "user", select: ['fullName', 'phoneNumber', 'email'] });
        return res.status(200).json({ status: 200, data: { appointments } });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, msg: error.message });
    }
});
exports.getAppointments = getAppointments;
const getAppointmentsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let id = req.params.id;
        const appointment = yield Appointments_1.default.findById(id)
            .populate({ path: "doctor", select: ['name', 'phoneNumber', 'email', 'role'] })
            .populate({ path: "pet", select: ['name', 'serialNumber', 'age', 'gender', 'imageUrl', 'notes'] })
            .populate({ path: "medacin" })
            .populate({ path: "user", select: ['fullName', 'phoneNumber', 'email'] });
        let lastCheckUp = '';
        let pet = appointment.pet;
        if (pet) {
            let lastAppointment = yield Appointments_1.default
                .find({ pet: pet._id, appointmentDate: { $lte: new Date() } })
                .sort({ appointmentDate: "desc" })
                .limit(1);
            lastCheckUp = String(((_a = lastAppointment[0]) === null || _a === void 0 ? void 0 : _a.appointmentDate) || '');
        }
        else {
            return res.status(200).json({ status: 200, data: { appointment: null } });
        }
        return res.status(200).json({ status: 200, data: { appointment: Object.assign(Object.assign({}, appointment === null || appointment === void 0 ? void 0 : appointment.toJSON()), { pet: Object.assign(Object.assign({}, pet.toJSON()), { lastCheckUp }) }) } });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, msg: error.message });
    }
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
    // handleAppointmentDate.setMinutes(0);
    // handleAppointmentDate.setSeconds(0);
    // handleAppointmentDate.setMilliseconds(0);
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
const userAppointments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let userId = req.params.id;
    if (!mongoose_1.default.isValidObjectId(userId))
        return res.status(400).json({ status: 400, msg: `userId ${userId} not valid` });
    let { page, pageSize, } = req.query;
    let numberPageSize = pageSize ? Number(pageSize) : 15;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let user = yield User_1.default.findById(userId).select(['fullName', 'phoneNumber', 'email', 'imageUrl']);
    if (!user)
        return res.status(400).json({ status: 400, msg: `user with id ${userId} not found` });
    let userAppointments = yield Appointments_1.default.find({ user: user._id })
        .skip(skip)
        .limit(numberPageSize)
        .populate({ path: "doctor", select: ['name', 'phoneNumber', 'email', 'role'] })
        .populate({ path: "pet", select: ['name', 'serialNumber', 'age'] });
    return res.status(200).json({ status: 200, data: { user, appointments: userAppointments } });
});
exports.userAppointments = userAppointments;
const addReportToAppointment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { report } = req.body;
    let appointmentId = req.params.id;
    if (!mongoose_1.default.isValidObjectId(appointmentId))
        return res.status(400).json({ status: 400, msg: `appointmentId ${appointmentId} not valid` });
    let isAppointmentExist = yield Appointments_1.default.findById(appointmentId);
    if (!isAppointmentExist)
        return res.status(400).json({ status: 400, msg: `there not appointment with id ${appointmentId}` });
    isAppointmentExist.report = report;
    yield isAppointmentExist.save();
    return res.status(200).json({ status: 200, data: { report } });
});
exports.addReportToAppointment = addReportToAppointment;
const deleteReportToAppointment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let appointmentId = req.params.id;
    if (!mongoose_1.default.isValidObjectId(appointmentId))
        return res.status(400).json({ status: 400, msg: `appointmentId ${appointmentId} not valid` });
    let isAppointmentExist = yield Appointments_1.default.findById(appointmentId);
    if (!isAppointmentExist)
        return res.status(400).json({ status: 400, msg: `there not appointment with id ${appointmentId}` });
    isAppointmentExist.report = '';
    yield isAppointmentExist.save();
    return res.status(200).json({ status: 200, msg: "report deleted successfully" });
});
exports.deleteReportToAppointment = deleteReportToAppointment;
