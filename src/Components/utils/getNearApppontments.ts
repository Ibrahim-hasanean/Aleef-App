import Appointments, { AppointmentsInterface } from "../../models/Appointments";

export default async function getNearApppontments(appointmentDate: Date, handleAppointmentDate: Date): Promise<AppointmentsInterface[]> {
    const before15MinAppointment = new Date(appointmentDate);
    before15MinAppointment.setMinutes(handleAppointmentDate.getMinutes() - 15);
    before15MinAppointment.setSeconds(0);
    before15MinAppointment.setMilliseconds(0);
    const after15MinAppointment = new Date(appointmentDate);
    after15MinAppointment.setMinutes(handleAppointmentDate.getMinutes() + 15);
    after15MinAppointment.setSeconds(0);
    after15MinAppointment.setMilliseconds(0);
    const isAppointmentDateHold = await Appointments
        .find({
            $or: [
                { appointmentDate: { $gte: handleAppointmentDate, $lt: after15MinAppointment, } },
                { appointmentDate: { $gt: before15MinAppointment, $lte: handleAppointmentDate } }
            ]
        });
    return isAppointmentDateHold;
}