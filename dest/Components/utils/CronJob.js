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
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const SendNotifications_1 = __importDefault(require("./SendNotifications"));
const appointmentsNotifications = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let date = (0, moment_timezone_1.default)().tz('Asia/Qatar');
        date.add({ milliseconds: 0 });
        let nowDate = new Date();
        nowDate.setMilliseconds(0);
        nowDate.setUTCHours(date.hours());
        let after_30_min = new Date();
        after_30_min.setUTCHours(date.hours());
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
        let nowAppointmentsUsersTokens = nowAppointmentsUsers
            .map((x) => x.registrationTokens)
            .flat().filter(x => typeof x == "string");
        let after30MinAppointmentsUsersTokens = after30MinAppointmentsUsers
            .map((x) => x.registrationTokens)
            .flat();
        if (nowAppointmentsUsersTokens.length > 0)
            yield (0, SendNotifications_1.default)(nowAppointmentsUsersTokens, {
                title: "Appointment meet", body: "You have appointments now"
            });
        if (after30MinAppointmentsUsersTokens.length > 0)
            yield (0, SendNotifications_1.default)(after30MinAppointmentsUsersTokens, {
                title: "Appointment meet", body: "You have appointments after 30 min"
            });
        // await sendNotifications(["c02ghdJLQkqN8r4R_NBqbK:APA91bEWmVsNGWnK7ZEWi8KMiXyoShi6vKwmYiN9slQsJU-ZuYXLV8COw1cdSkO6GBUlUINOOp2aEvYZoP1S-Vfq38HANGYAsE_Oj_p2_uW1IkDICEJcFBKq3nN0vtCIKRWMUeI02_jY"], { title: "test", body: "test msg test" })
        // let date = new Date();
        // console.log(date.toLocaleString("en-US", { timeZone: 'Asia/Qatar' }));
        // console.log(date);
        // console.log(nowDate);
        // console.log(after_30_min);
        // console.log(nowAppointments);
        // console.log(after_30min_Appointments);
        // console.log(nowAppointmentsUsersTokens)
        // console.log(after30MinAppointmentsUsersTokens)
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = appointmentsNotifications;
