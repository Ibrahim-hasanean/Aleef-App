import { NextFunction, Request, Response } from "express";
import Appointments, { AppointmentsInterface } from "../../../models/Appointments";
import getNearApppontments from "../../utils/getNearApppontments";

export const addAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const { petId, serviceId, appointmentDate, reason, doctorId } = req.body;
    const user = req.user;
    const handleAppointmentDate = new Date(appointmentDate);
    handleAppointmentDate.setSeconds(0);
    handleAppointmentDate.setMilliseconds(0);
    const isAppointmentDateHold: AppointmentsInterface[] = await getNearApppontments(appointmentDate, handleAppointmentDate);
    if (isAppointmentDateHold.length > 0) return res.status(409).json({ status: 409, msg: "appointment date is hold" });
    const newAppontment = await Appointments.create({
        pet: petId,
        service: serviceId,
        appointmentDate: handleAppointmentDate,
        reason,
        doctorId,
        user: user._id,
    });
    return res.status(201).json({ status: 201, msg: "appointment created successfully", data: { newAppontment } });
}

export const updateAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const { petId, serviceId, appointmentDate, reason, doctorId } = req.body;
    const user = req.user;
    const handleAppointmentDate = new Date(appointmentDate);
    handleAppointmentDate.setSeconds(0);
    handleAppointmentDate.setMilliseconds(0);
    const isAppointmentDateHold: AppointmentsInterface[] = await getNearApppontments(appointmentDate, handleAppointmentDate);
    if (isAppointmentDateHold.length > 0) return res.status(409).json({ status: 409, msg: "appointment date is hold" });
    const newAppontment = await Appointments.create({
        pet: petId,
        service: serviceId,
        appointmentDate: handleAppointmentDate,
        reason,
        doctorId,
        user: user._id,
    });
    return res.status(201).json({ status: 201, msg: "appointment created successfully", data: { newAppontment } });
}

export const getAppointments = async (req: Request, res: Response, next: NextFunction) => {
    let { page, pageSize } = req.query;
    let numberPageSize = pageSize ? Number(pageSize) : 10;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let user = req.user;
    const appointments = await Appointments.find({ user: user._id }).sort("appointmentDate").skip(skip).limit(numberPageSize);
    return res.status(200).json({ status: 200, data: { appointments } });
}


export const getAppointmentsById = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    const appointment = await Appointments.findById(id);
    return res.status(200).json({ status: 200, data: { appointment } });

}

export const deleteAppointments = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    const appointment = await Appointments.findByIdAndDelete(id);
    return res.status(200).json({ status: 200, msg: "appointment deleted successfully" });

}
