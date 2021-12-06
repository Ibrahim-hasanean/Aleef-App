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
    const filterFreeDoctors = freeDoctors.filter((doctor: StafInterface) => {
        const isActive = doctor.workHoures.get(day).isActive;

        let beginDate: Date = doctor.workHoures.get(day).from;
        // let doctorBeginHours = new Date(doctor.workHoures.get(day).from);
        let todayBeginHouerseDate = new Date(appointmentDate);
        todayBeginHouerseDate.setUTCHours(beginDate.getUTCHours());
        todayBeginHouerseDate.setMinutes(beginDate.getMinutes());
        todayBeginHouerseDate.setSeconds(0);
        todayBeginHouerseDate.setMilliseconds(0);


        // let doctorEndHours = new Date(doctor.workHoures.get(day).to);
        let endDate: Date = doctor.workHoures.get(day).to;
        let todayEndHouerseDate = new Date(appointmentDate);
        todayEndHouerseDate.setUTCHours(endDate.getUTCHours());
        todayEndHouerseDate.setMinutes(endDate.getMinutes());
        todayEndHouerseDate.setSeconds(0);
        todayEndHouerseDate.setMilliseconds(0);

        let isInWorkHouresRange =
            time.isBetween(todayBeginHouerseDate, todayEndHouerseDate, undefined, '[]')


        return isActive && isInWorkHouresRange;
    });


    return filterFreeDoctors;
}