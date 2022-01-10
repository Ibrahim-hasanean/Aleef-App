import Appointments from "../../models/Appointments";
import moment from "moment-timezone";
import sendNotifications from "./SendNotifications";
import { UserInterface } from "../../models/User";
const appointmentsNotifications = async () => {
    try {
        let date = moment().tz('Asia/Qatar');
        date.add({ milliseconds: 0 })
        let nowDate = new Date();
        nowDate.setMilliseconds(0);
        nowDate.setUTCHours(date.hours());
        let after_30_min = new Date();
        after_30_min.setUTCHours(date.hours());
        after_30_min.setMinutes(after_30_min.getMinutes() + 30);
        after_30_min.setMilliseconds(0);
        let nowAppointments = await Appointments
            .find({ appointmentDate: nowDate })
            .select(['user', 'appointmentDate'])
            .populate({ path: "user", select: ['fullName', 'registrationTokens'] })
            .populate({ path: "doctor", select: ['name', 'registrationTokens'] });
        let after_30min_Appointments = await Appointments
            .find({ appointmentDate: after_30_min })
            .select(['user', 'appointmentDate'])
            .populate({ path: "user", select: ['fullName', 'registrationTokens'] })
            .populate({ path: "doctor", select: ['name', 'registrationTokens'] });
        let nowAppointmentsUsers: UserInterface[] = nowAppointments.map(x => x.user) as UserInterface[];
        let after30MinAppointmentsUsers: UserInterface[] = after_30min_Appointments.map(x => x.user) as UserInterface[];
        let nowAppointmentsUsersTokens = nowAppointmentsUsers
            .map((x: UserInterface) => x.registrationTokens)
            .flat().filter(x => typeof x == "string");
        let after30MinAppointmentsUsersTokens = after30MinAppointmentsUsers
            .map((x: UserInterface) => x.registrationTokens)
            .flat();

        if (nowAppointmentsUsersTokens.length > 0) await sendNotifications(
            nowAppointmentsUsersTokens,
            {
                title: "Appointment meet", body: "You have appointments now"
            }
        );
        if (after30MinAppointmentsUsersTokens.length > 0) await sendNotifications(
            after30MinAppointmentsUsersTokens,
            {
                title: "Appointment meet", body: "You have appointments after 30 min"
            }
        );


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

    } catch (error) {
        console.log(error)
    }
}
export default appointmentsNotifications;