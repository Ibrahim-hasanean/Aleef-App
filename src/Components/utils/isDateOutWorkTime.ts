export default function isDateOutWorkTime(appointmentDate: Date): boolean {
    const BeginWorkTime = new Date(appointmentDate);
    BeginWorkTime.setUTCHours(9);
    BeginWorkTime.setMinutes(0);
    BeginWorkTime.setSeconds(0);
    BeginWorkTime.setMilliseconds(0);

    const EndWorkTime = new Date(appointmentDate);
    EndWorkTime.setUTCHours(17);
    EndWorkTime.setMinutes(45);
    EndWorkTime.setSeconds(0);
    EndWorkTime.setMilliseconds(0);

    if (appointmentDate < BeginWorkTime || appointmentDate > EndWorkTime) {
        return true;
    }
    return false;
}