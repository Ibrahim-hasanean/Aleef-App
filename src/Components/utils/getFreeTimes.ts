import Appointments from "../../models/Appointments";
import moment from "moment";
import PeriodTime from "../types/PeriodTime";
import Staff, { StafInterface, workHouresInterface } from "../../models/Staff";
export default async function (date: Date): Promise<PeriodTime[]> {
    let freeHours: PeriodTime[] = [];

    let startWorkHours = new Date(moment(date).format("YYYY-MM-DD"));
    startWorkHours.setUTCHours(8);
    startWorkHours.setMinutes(0);
    startWorkHours.setSeconds(0);
    startWorkHours.setMilliseconds(0);

    let EndHours = new Date(moment(date).format("YYYY-MM-DD"));
    EndHours.setUTCHours(18);
    EndHours.setMinutes(0);
    EndHours.setSeconds(0);
    EndHours.setMilliseconds(0);

    const appointments = await Appointments.find({ appointmentDate: { $gte: startWorkHours, $lt: EndHours, } })
        .select(['appointmentDate', 'doctor']);

    let time = moment(startWorkHours);

    let day = String(time.format("dddd")).toLowerCase();

    const doctors: StafInterface[] = await Staff.find({ role: "doctor" });
    while (time.toDate() < EndHours) {
        const beginPeriod = moment(time).toDate();
        const endPeriod = moment(time).add(15, 'minutes').toDate();
        const isTimePeriodHold = appointments.filter(x => x.appointmentDate >= beginPeriod && x.appointmentDate < endPeriod).map(x => x.doctor);


        const freeDoctors = doctors
            .filter((doctor: StafInterface) => {
                let isHold = isTimePeriodHold.findIndex(doctorId => String(doctorId) === String(doctor._id)) === -1;
                let isActive = doctor.workHoures.get(day).isActive;

                let beginDate: Date = doctor.workHoures.get(day).from;
                let doctorBeginHours: Date = new Date()
                doctorBeginHours.setUTCHours(beginDate.getUTCHours());
                doctorBeginHours.setMinutes(beginDate.getMinutes());
                doctorBeginHours.setSeconds(0);
                doctorBeginHours.setMilliseconds(0);
                doctorBeginHours.setDate(date.getDate());
                doctorBeginHours.setMonth(date.getMonth());
                doctorBeginHours.setFullYear(date.getFullYear());

                let endDate: Date = doctor.workHoures.get(day).to;
                let doctorEndHours = new Date();
                doctorEndHours.setUTCHours(endDate.getUTCHours());
                doctorEndHours.setMinutes(endDate.getMinutes());
                doctorEndHours.setMilliseconds(0);
                doctorEndHours.setSeconds(0);
                doctorEndHours.setDate(date.getDate());
                doctorEndHours.setMonth(date.getMonth());
                doctorEndHours.setFullYear(date.getFullYear());


                let isInWorkHouresRange = moment(beginPeriod).isBetween(doctorBeginHours, doctorEndHours, undefined, '[]') &&
                    moment(endPeriod).isBetween(doctorBeginHours, doctorEndHours, undefined, '[]');

                return isHold && isActive && isInWorkHouresRange;
            }
            );
        if (freeDoctors.length > 0) {
            freeHours.push({ from: beginPeriod, to: endPeriod });
        }
        time = time.add(15, 'minutes');
    }

    return freeHours;
}