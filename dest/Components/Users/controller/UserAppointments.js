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
const Pets_1 = __importDefault(require("../../../models/Pets"));
const paymentMethod_1 = require("../../utils/paymentMethod");
const addAppointment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { petId, service, appointmentDate, reason } = req.body;
    const user = req.user;
    let isPetExist = yield Pets_1.default.findOne({ _id: petId, user: user._id });
    if (!isPetExist)
        return res.status(400).json({ status: 400, msg: `pet with id ${petId} not exist` });
    const handleAppointmentDate = new Date(appointmentDate);
    handleAppointmentDate.setSeconds(0);
    handleAppointmentDate.setMilliseconds(0);
    let nowDate = new Date();
    if (handleAppointmentDate < nowDate)
        return res.status(400).json({ status: 400, msg: "can not book appointment in past time" });
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
        doctor: freeDoctors[0]._id,
        user: user._id,
        status: "upcoming"
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
    let { page, pageSize, service, doctorId, paymentStatus, petId, status, day, } = req.query;
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
    if (status)
        query.status = status;
    if (day) {
        let beginDay = new Date(day);
        beginDay.setHours(1);
        beginDay.setMinutes(0);
        let endDay = day ? new Date(day) : new Date();
        endDay.setHours(24);
        endDay.setMinutes(0);
        query.appointmentDate = { $gte: beginDay, $lte: endDay };
    }
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
    const appointment = yield Appointments_1.default.findOne({ _id: id, user: user._id })
        .populate("doctor")
        .populate("pet")
        .populate("medacin");
    return res.status(200).json({ status: 200, data: { appointment } });
});
exports.getAppointmentsById = getAppointmentsById;
const deleteAppointments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let user = req.user;
    if (!mongoose_1.default.isValidObjectId(id)) {
        return res.status(400).json({ status: 400, msg: "appointmentId not found" });
    }
    const appointment = yield Appointments_1.default.findOne({ _id: id, user: user._id });
    if (!appointment)
        return res.status(400).json({ status: 400, msg: "appointment not found" });
    appointment.status = "cancelled";
    if (appointment.paymentIntentId) {
        yield (0, paymentMethod_1.cancelPayment)(appointment.paymentIntentId);
    }
    yield appointment.save();
    return res.status(200).json({ status: 200, msg: "appointment cancelled successfully" });
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
    var _a;
    try {
        let { totalAmount, discount, paymentAmmount, exchange, appointmentId, currency } = req.body;
        let user = req.user;
        const isAppointmentExist = yield Appointments_1.default.findById(appointmentId);
        if (!isAppointmentExist)
            return res.status(400).json({ status: 400, msg: `appointment with id ${appointmentId} not exist` });
        let paymentIntent = yield (0, paymentMethod_1.paymentMethod)(paymentAmmount, currency, `new payment for appointment ${appointmentId}`);
        let newPayment = yield Payment_1.default.create({
            totalAmount,
            discount,
            paymentAmmount,
            exchange,
            paymentType: "visa",
            user: user._id,
            appointment: appointmentId,
            paymentIntentId: paymentIntent.id,
        });
        isAppointmentExist.paymentIntentId = paymentIntent.id;
        isAppointmentExist.payment = newPayment._id;
        yield isAppointmentExist.save();
        return res.status(201).json({ status: 201, msg: "payment success", data: { payment: newPayment, clientSecret: paymentIntent.client_secret } });
    }
    catch (error) {
        return res.status(400).json({ status: 400, msg: (_a = error.message) !== null && _a !== void 0 ? _a : error });
    }
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
    let { page, limit, day } = req.query;
    let user = req.user;
    let numberPageSize = limit ? Number(limit) : 2;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let beginDay = day ? new Date(day) : new Date();
    beginDay.setHours(1);
    beginDay.setMinutes(0);
    let endDay = day ? new Date(day) : new Date();
    endDay.setHours(24);
    endDay.setMinutes(0);
    // console.log(beginDay)
    // console.log(endDay)
    let appointmentsQuery = {};
    if (day) {
        appointmentsQuery = { $gte: beginDay, $lte: endDay };
    }
    else {
        appointmentsQuery = { $gte: beginDay };
    }
    let pets = yield Pets_1.default.find({ user: user._id })
        .populate({
        path: "appointments",
        select: "appointmentDate",
        match: { appointmentDate: appointmentsQuery },
        options: {
            sort: { appointmentDate: "asc" },
        },
        // limit:  1
    })
        .populate({
        path: "vaccinations",
        select: "date",
        match: { date: { $gte: beginDay, $lte: endDay } }, options: {
            sort: { date: "asc" },
            limit: 1
        },
    });
    const nextVaccination = pets
        .filter(x => x.vaccinations.length > 0)
        .map(pet => {
        var _a;
        let vaccination = pet.vaccinations[0];
        return ({
            name: pet.name,
            date: (_a = vaccination === null || vaccination === void 0 ? void 0 : vaccination.date) !== null && _a !== void 0 ? _a : ""
        });
        // .map((x) => {
        //     let vacination: PetsVaccination = x as PetsVaccination;
        //     return vacination.dates;
        // })
        // .flat()
        // .filter(x => new Date(x) > beginDay && new Date(x) < endDay)
        // .sort((x: Date, b: Date) => (new Date(x).getTime() - new Date(b).getTime()))[0]
    });
    let nextAppontments = pets.filter(x => x.appointments.length > 0).map(pet => ({ name: pet.name, date: pet.appointments }));
    return res.status(200).json({ status: 200, data: { nextVaccination, nextAppontments, pets } });
});
exports.getReminder = getReminder;
