import Appointments from "../../models/Appointments";
import moment from "moment"
import Staff, { StafInterface } from "../../models/Staff";
export default async function getFreeDoctors(appointmentDate: Date | string, handleAppointmentDate: Date): Promise<StafInterface[]> {
    const before15MinAppointment = new Date(appointmentDate);
    before15MinAppointment.setMinutes(handleAppointmentDate.getMinutes() - 15);
    before15MinAppointment.setSeconds(0);
    before15MinAppointment.setMilliseconds(0);
    const after15MinAppointment = new Date(appointmentDate);
    after15MinAppointment.setMinutes(handleAppointmentDate.getMinutes() + 15);
    after15MinAppointment.setSeconds(0);
    after15MinAppointment.setMilliseconds(0);

    let time = moment(appointmentDate);
    let day = String(time.format("dddd")).toLowerCase();
    console.log(day)

    const isAppointmentDateHold = await Appointments
        .find({
            $or: [
                { appointmentDate: { $gte: handleAppointmentDate, $lt: after15MinAppointment, } },
                { appointmentDate: { $gt: before15MinAppointment, $lte: handleAppointmentDate } }
            ]
        });

    const busyDoctors = isAppointmentDateHold.map(x => x.doctor);
    const freeDoctors: StafInterface[] = await Staff.find({
        _id: { $nin: busyDoctors }, role: "doctor"
    });
    const filterFreeDoctors = freeDoctors.filter((doctor: StafInterface) => doctor.workHoures.get(day).isActive);

    return filterFreeDoctors;
}