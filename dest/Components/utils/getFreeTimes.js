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
function default_1(date) {
    return __awaiter(this, void 0, void 0, function* () {
        let freeHours = [];
        let startWorkHours = new Date((0, moment_1.default)(date).format("YYYY-MM-DD"));
        startWorkHours.setUTCHours(8);
        startWorkHours.setMinutes(0);
        startWorkHours.setSeconds(0);
        startWorkHours.setMilliseconds(0);
        let EndHours = new Date((0, moment_1.default)(date).format("YYYY-MM-DD"));
        EndHours.setUTCHours(18);
        EndHours.setMinutes(0);
        EndHours.setSeconds(0);
        EndHours.setMilliseconds(0);
        const appointments = yield Appointments_1.default.find({ appointmentDate: { $gte: startWorkHours, $lt: EndHours, } })
            .select(['appointmentDate', 'doctor']);
        let time = (0, moment_1.default)(startWorkHours);
        let day = String(time.format("dddd")).toLowerCase();
        const doctors = yield Staff_1.default.find({ role: "doctor" });
        while (time.toDate() < EndHours) {
            const beginPeriod = (0, moment_1.default)(time).toDate();
            const endPeriod = (0, moment_1.default)(time).add(15, 'minutes').toDate();
            const isTimePeriodHold = appointments.filter(x => x.appointmentDate >= beginPeriod && x.appointmentDate < endPeriod).map(x => x.doctor);
            const freeDoctors = doctors
                .filter((doctor) => {
                let isHold = isTimePeriodHold.findIndex(doctorId => String(doctorId) === String(doctor._id)) === -1;
                let isActive = doctor.workHoures.get(day).isActive;
                let beginDate = doctor.workHoures.get(day).from;
                let doctorBeginHours = new Date();
                doctorBeginHours.setUTCHours(beginDate.getUTCHours());
                doctorBeginHours.setMinutes(beginDate.getMinutes());
                doctorBeginHours.setSeconds(0);
                doctorBeginHours.setMilliseconds(0);
                doctorBeginHours.setDate(date.getDate());
                doctorBeginHours.setMonth(date.getMonth());
                doctorBeginHours.setFullYear(date.getFullYear());
                let endDate = doctor.workHoures.get(day).to;
                let doctorEndHours = new Date();
                doctorEndHours.setUTCHours(endDate.getUTCHours());
                doctorEndHours.setMinutes(endDate.getMinutes());
                doctorEndHours.setMilliseconds(0);
                doctorEndHours.setSeconds(0);
                doctorEndHours.setDate(date.getDate());
                doctorEndHours.setMonth(date.getMonth());
                doctorEndHours.setFullYear(date.getFullYear());
                let isInWorkHouresRange = (0, moment_1.default)(beginPeriod).isBetween(doctorBeginHours, doctorEndHours, undefined, '[]') &&
                    (0, moment_1.default)(endPeriod).isBetween(doctorBeginHours, doctorEndHours, undefined, '[]');
                return isHold && isActive && isInWorkHouresRange;
            });
            if (freeDoctors.length > 0) {
                freeHours.push({ from: beginPeriod, to: endPeriod });
            }
            time = time.add(15, 'minutes');
        }
        return freeHours;
    });
}
exports.default = default_1;
