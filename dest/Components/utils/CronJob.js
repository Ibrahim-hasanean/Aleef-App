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
const appointmentsNotifications = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let nowDate = new Date();
        nowDate.setMilliseconds(0);
        let after_30_min = new Date();
        after_30_min.setMinutes(after_30_min.getMinutes() + 30);
        after_30_min.setMilliseconds(0);
        let nowAppointments = yield Appointments_1.default
            .find({ appointmentDate: nowDate })
            .select(['user', 'appointmentDate'])
            .populate({ path: "user", select: ['fullName', 'registrationTokens'] })
            .populate({ path: "doctor", select: ['name', 'registrationTokens'] });
        let after_30min_Appointments = yield Appointments_1.default
            .find({ appointmentDate: after_30_min })
            .select(['user', 'appointmentDate'])
            .populate({ path: "user", select: ['fullName', 'registrationTokens'] })
            .populate({ path: "doctor", select: ['name', 'registrationTokens'] });
        let nowAppointmentsUsers = nowAppointments.map(x => x.user);
        let after30MinAppointmentsUsers = after_30min_Appointments.map(x => x.user);
        console.log(nowDate);
        console.log(after_30_min);
        // console.log(appointments);
        console.log(nowAppointments);
        console.log(after_30min_Appointments);
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = appointmentsNotifications;
