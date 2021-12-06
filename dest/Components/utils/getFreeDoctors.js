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
const Appointments_1 = __importDefault(require("../../models/Appointments"));
const moment_1 = __importDefault(require("moment"));
const Staff_1 = __importDefault(require("../../models/Staff"));
function getFreeDoctors(appointmentDate, handleAppointmentDate) {
    return __awaiter(this, void 0, void 0, function* () {
        const before15MinAppointment = new Date(appointmentDate);
        before15MinAppointment.setMinutes(handleAppointmentDate.getMinutes() - 15);
        before15MinAppointment.setSeconds(0);
        before15MinAppointment.setMilliseconds(0);
        const after15MinAppointment = new Date(appointmentDate);
        after15MinAppointment.setMinutes(handleAppointmentDate.getMinutes() + 15);
        after15MinAppointment.setSeconds(0);
        after15MinAppointment.setMilliseconds(0);
        let time = (0, moment_1.default)(appointmentDate);
        let day = String(time.format("dddd")).toLowerCase();
        const isAppointmentDateHold = yield Appointments_1.default
            .find({
            $or: [
                { appointmentDate: { $gte: handleAppointmentDate, $lt: after15MinAppointment, } },
                { appointmentDate: { $gt: before15MinAppointment, $lte: handleAppointmentDate } }
            ]
        });
        const busyDoctors = isAppointmentDateHold.map(x => x.doctor);
        const freeDoctors = yield Staff_1.default.find({
            _id: { $nin: busyDoctors }, role: "doctor"
        });
        const filterFreeDoctors = freeDoctors.filter((doctor) => {
            const isActive = doctor.workHoures.get(day).isActive;
            let beginDate = doctor.workHoures.get(day).from;
            // let doctorBeginHours = new Date(doctor.workHoures.get(day).from);
            let todayBeginHouerseDate = new Date(appointmentDate);
            todayBeginHouerseDate.setUTCHours(beginDate.getUTCHours());
            todayBeginHouerseDate.setMinutes(beginDate.getMinutes());
            todayBeginHouerseDate.setSeconds(0);
            todayBeginHouerseDate.setMilliseconds(0);
            // let doctorEndHours = new Date(doctor.workHoures.get(day).to);
            let endDate = doctor.workHoures.get(day).to;
            let todayEndHouerseDate = new Date(appointmentDate);
            todayEndHouerseDate.setUTCHours(endDate.getUTCHours());
            todayEndHouerseDate.setMinutes(endDate.getMinutes());
            todayEndHouerseDate.setSeconds(0);
            todayEndHouerseDate.setMilliseconds(0);
            let isInWorkHouresRange = time.isBetween(todayBeginHouerseDate, todayEndHouerseDate, undefined, '[]');
            return isActive && isInWorkHouresRange;
        });
        return filterFreeDoctors;
    });
}
exports.default = getFreeDoctors;
