import Appointments from "../../models/Appointments";
import moment from "moment";
import PeriodTime from "../types/PeriodTime";
import Staff, { StafInterface } from "../../models/Staff";
export default async function (date: Date): Promise<PeriodTime[]> {
    let freeHours: PeriodTime[] = [];

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

    const appointments = await Appointments.find({ appointmentDate: { $gte: startWorkHours, $lt: EndHours, } })
        .select(['appointmentDate', 'doctor']);

    const appointmentDates: Date[] = appointments.map(x => x.appointmentDate);
    let time = moment(startWorkHours);

    const doctors: StafInterface[] = await Staff.find({ role: "doctor" });
    const doctorsIds = doctors.map(doctor => doctor._id);

    while (time.toDate() < EndHours) {
        const beginPeriod = moment(time);
        const endPeriod = moment(time).add(15, 'minutes');
        const isTimePeriodHold = appointments.filter(x => x.appointmentDate >= beginPeriod.toDate() && x.appointmentDate < endPeriod.toDate()).map(x => x.doctor);
        // if (isTimePeriodHold.length !== doctorsIds.length) {
        //     freeHours.push({ from: beginPeriod.toDate(), to: endPeriod.toDate() });
        // };
        const freeDoctors = doctors
            .filter(doctor =>
                isTimePeriodHold.findIndex(doctorId => String(doctorId) === String(doctor._id)) === -1
            );
        if (freeDoctors.length > 0) {
            freeHours.push({ from: beginPeriod.toDate(), to: endPeriod.toDate() });
        }
        time = time.add(15, 'minutes');
    }
    // while (time.toDate() < EndHours) {
    //     const beginPeriod = moment(time);
    //     const endPeriod = moment(time).add(15, 'minutes');
    //     const isTimePeriodHold = appointmentDates.filter(x => x >= beginPeriod.toDate() && x <= endPeriod.toDate());
    //     if (isTimePeriodHold.length === 0) {
    //         freeHours.push({ from: beginPeriod.toDate(), to: endPeriod.toDate() });
    //     };
    //     time = time.add(15, 'minutes');
    // }
    return freeHours;
}