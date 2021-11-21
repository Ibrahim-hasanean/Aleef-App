import Appointments from "../../models/Appointments";
import moment from "moment";
import PeriodTime from "../types/PeriodTime";
import Staff, { StafInterface, workHouresInterface } from "../../models/Staff";
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
    let day = String(time.format("dddd")).toLowerCase();
    console.log(String(day).toLowerCase());
    const doctors: StafInterface[] = await Staff.find({ role: "doctor" });
    while (time.toDate() < EndHours) {
        const beginPeriod = moment(time);
        const endPeriod = moment(time).add(15, 'minutes');
        const isTimePeriodHold = appointments.filter(x => x.appointmentDate >= beginPeriod.toDate() && x.appointmentDate < endPeriod.toDate()).map(x => x.doctor);

        const freeDoctors = doctors
            .filter((doctor: StafInterface) => {
                let isHold = isTimePeriodHold.findIndex(doctorId => String(doctorId) === String(doctor._id)) === -1
                let isActive = doctor.workHoures.get(day).isActive;
                let isInWorkHouresRange =
                    new Date(doctor.workHoures.get(day).from).getHours() < beginPeriod.toDate().getHours()
                    && new Date(doctor.workHoures.get(day).to).getHours() > endPeriod.toDate().getHours();
                return isHold && isActive && isInWorkHouresRange;
            }
            );

        if (freeDoctors.length > 0) {
            freeHours.push({ from: beginPeriod.toDate(), to: endPeriod.toDate() });
        }
        time = time.add(15, 'minutes');
    }

    return freeHours;
}