import Appointments from "../../models/Appointments";
const appointmentsNotifications = async () => {
    try {
        let nowDate = new Date();
        nowDate.setMilliseconds(0);
        let after_30_min = new Date();
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
        let nowAppointmentsUsers = nowAppointments.map(x => x.user);
        let after30MinAppointmentsUsers = after_30min_Appointments.map(x => x.user);
        console.log(nowDate);
        console.log(after_30_min);
        // console.log(appointments);
        console.log(nowAppointments);
        console.log(after_30min_Appointments);

    } catch (error) {
        console.log(error)
    }
}

export default appointmentsNotifications;