import Appointments from "../../models/Appointments";
import moment from "moment";
import PeriodTime from "../types/PeriodTime";
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
        .select(['appointmentDate']);
    const appointmentDates: Date[] = appointments.map(x => x.appointmentDate);
    let time = moment(startWorkHours);

    while (time.toDate() < EndHours) {
        const beginPeriod = moment(time);
        const endPeriod = moment(time).add(15, 'minutes');
        const isTimePeriodHold = appointmentDates.filter(x => x >= beginPeriod.toDate() && x <= endPeriod.toDate());
        if (isTimePeriodHold.length === 0) {
            freeHours.push({ from: beginPeriod.toDate(), to: endPeriod.toDate() });
        };
        time = time.add(15, 'minutes');
    }
    return freeHours;
}