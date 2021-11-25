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
        let startWorkHours = new Date(date);
        startWorkHours.setUTCHours(9);
        startWorkHours.setMinutes(0);
        startWorkHours.setSeconds(0);
        startWorkHours.setMilliseconds(0);
        let EndHours = new Date(date);
        EndHours.setUTCHours(18);
        EndHours.setMinutes(0);
        EndHours.setSeconds(0);
        EndHours.setMilliseconds(0);
        const appointments = yield Appointments_1.default.find({ appointmentDate: { $gte: startWorkHours, $lt: EndHours, } })
            .select(['appointmentDate', 'doctor']);
        // const appointmentDates: Date[] = appointments.map(x => x.appointmentDate);
        let time = (0, moment_1.default)(startWorkHours);
        let day = String(time.format("dddd")).toLowerCase();
        console.log(String(day).toLowerCase());
        const doctors = yield Staff_1.default.find({ role: "doctor" });
        while (time.toDate() < EndHours) {
            const beginPeriod = (0, moment_1.default)(time);
            const endPeriod = (0, moment_1.default)(time).add(15, 'minutes');
            const isTimePeriodHold = appointments.filter(x => x.appointmentDate >= beginPeriod.toDate() && x.appointmentDate < endPeriod.toDate()).map(x => x.doctor);
            const freeDoctors = doctors
                .filter((doctor) => {
                let isHold = isTimePeriodHold.findIndex(doctorId => String(doctorId) === String(doctor._id)) === -1;
                let isActive = doctor.workHoures.get(day).isActive;
                // console.log(moment(doctor.workHoures.get(day).from).toDate().getHours());
                // console.log(beginPeriod.toDate().getHours());
                let isInWorkHouresRange = (0, moment_1.default)(doctor.workHoures.get(day).from).hours() <= beginPeriod.hours()
                    && (0, moment_1.default)(doctor.workHoures.get(day).to).hours() >= endPeriod.hours();
                return isHold && isActive && isInWorkHouresRange;
            });
            if (freeDoctors.length > 0) {
                freeHours.push({ from: beginPeriod.toDate(), to: endPeriod.toDate() });
            }
            time = time.add(15, 'minutes');
        }
        return freeHours;
    });
}
exports.default = default_1;
