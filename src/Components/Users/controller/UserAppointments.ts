import { NextFunction, Request, Response } from "express";
import Appointments, { AppointmentsInterface } from "../../../models/Appointments";
import { StafInterface } from "../../../models/Staff";
import getFreeTimes from "../../utils/getFreeTimes";
import getFreeDoctors from "../../utils/getFreeDoctors";
import isDateOutWorkTime from "../../utils/isDateOutWorkTime";

export const addAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const { petId, serviceId, appointmentDate, reason } = req.body;
    const user = req.user;
    const handleAppointmentDate = new Date(appointmentDate);
    handleAppointmentDate.setSeconds(0);
    handleAppointmentDate.setMilliseconds(0);
    const isAppointmentOutOfWorkHours: boolean = isDateOutWorkTime(handleAppointmentDate);
    if (isAppointmentOutOfWorkHours) return res.status(400).json({ status: 400, msg: "appointment date is out of work hours" });
    const freeDoctors: StafInterface[] = await getFreeDoctors(appointmentDate, handleAppointmentDate);
    if (freeDoctors.length === 0) return res.status(409).json({ status: 409, msg: "there is no free doctors" });
    const newAppontment = await Appointments.create({
        pet: petId,
        service: serviceId,
        appointmentDate: handleAppointmentDate,
        reason,
        doctor: freeDoctors[0]._id,
        user: user._id,
    });
    return res.status(201).json({
        status: 201, msg: "appointment created successfully",
        data: { newAppontment }
    });
}

export const updateAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const { petId, serviceId, appointmentDate, reason, doctorId } = req.body;
    const user = req.user;
    let appointmentId = req.params.id;
    const appointment = await Appointments.findById(appointmentId);
    if (!appointment) return res.status(400).json({ status: 400, msg: "apppointment not found" });
    const handleAppointmentDate = new Date(appointmentDate);
    handleAppointmentDate.setSeconds(0);
    handleAppointmentDate.setMilliseconds(0);
    const isAppointmentOutOfWorkHours: boolean = isDateOutWorkTime(handleAppointmentDate);
    if (isAppointmentOutOfWorkHours) return res.status(400).json({ status: 400, msg: "appointment date is out of work hours" });
    const freeDoctors: StafInterface[] = await getFreeDoctors(appointmentDate, handleAppointmentDate);
    // if (isAppointmentDateHold.length > 0) {
    //     if (isAppointmentDateHold.length === 1 && String(isAppointmentDateHold[0]._id) != String(appointment._id))
    //         return res.status(409).json({ status: 409, msg: "new appointment date is conflict with other appointments" });
    //     if (isAppointmentDateHold.length > 1)
    //         return res.status(409).json({ status: 409, msg: "new appointment date is conflict with other appointments" });
    // }
    if (freeDoctors.length === 0) return res.status(409).json({ status: 409, msg: "there is no free doctors" });
    const newAppontment = await Appointments.findByIdAndUpdate(appointmentId, {
        pet: petId,
        service: serviceId,
        appointmentDate: handleAppointmentDate,
        reason,
        doctor: freeDoctors[0]._id,
        user: user._id,
    });
    return res.status(201).json({
        status: 201, msg: "appointment updated successfully", data: {
            appontment: newAppontment
        }
    });
}

export const getAppointments = async (req: Request, res: Response, next: NextFunction) => {
    let { page, pageSize, serviceId, doctorId, paymentStatus } = req.query;
    let numberPageSize = pageSize ? Number(pageSize) : 15;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let user = req.user;
    let query: any = { user: user._id };
    if (serviceId) query.service = serviceId;
    if (doctorId) query.doctor = doctorId;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    const appointments = await Appointments.find(query).populate("doctor").sort({ appointmentDate: "desc" }).skip(skip).limit(numberPageSize);
    return res.status(200).json({ status: 200, data: { appointments } });
}

export const getAppointmentsById = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let user = req.user;
    const appointment = await Appointments.findOne({ _id: id, user: user._id });
    return res.status(200).json({ status: 200, data: { appointment } });
}

export const deleteAppointments = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let user = req.user;
    const appointment = await Appointments.findOneAndDelete({ _id: id, user: user._id });
    return res.status(200).json({ status: 200, msg: "appointment deleted successfully" });
}

export const getAvaliableTime = async (req: Request, res: Response, next: NextFunction) => {
    let { day } = req.query as { day: string };
    const handleAppointmentDate = new Date(day);
    handleAppointmentDate.setMinutes(0);
    handleAppointmentDate.setSeconds(0);
    handleAppointmentDate.setMilliseconds(0);
    const appointmentDates = await getFreeTimes(handleAppointmentDate);
    return res.status(200).json({ status: 200, data: { appointmentDates } });
}