import Appointments, { AppointmentsInterface } from "../../../../models/Appointments";
import { Request, Response, NextFunction } from "express";
import { StafInterface } from "../../../../models/Staff";
import getFreeTimes from "../../../utils/getFreeTimes";
import getFreeDoctors from "../../../utils/getFreeDoctors";
import isDateOutWorkTime from "../../../utils/isDateOutWorkTime";
import Pets, { PetsInterface } from "../../../../models/Pets";
import User, { UserInterface } from "../../../../models/User";

export const addAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const { petId, service, appointmentDate, reason, userId, doctorId } = req.body;
    let isPetExist: PetsInterface = await Pets.findOne({ _id: petId, user: userId }) as PetsInterface;
    if (!isPetExist) return res.status(400).json({ status: 400, msg: `pet with id ${petId} not exist` });
    let isUserExist: UserInterface = await User.findById(userId) as UserInterface;
    if (!isUserExist) return res.status(400).json({ status: 400, msg: `user with id ${userId} not exist` });
    const handleAppointmentDate = new Date(appointmentDate);
    handleAppointmentDate.setSeconds(0);
    handleAppointmentDate.setMilliseconds(0);
    const isAppointmentOutOfWorkHours: boolean = isDateOutWorkTime(handleAppointmentDate);
    if (isAppointmentOutOfWorkHours) return res.status(400).json({ status: 400, msg: "appointment date is out of work hours" });
    const freeDoctors: StafInterface[] = await getFreeDoctors(appointmentDate, handleAppointmentDate);
    if (freeDoctors.length === 0) return res.status(409).json({ status: 409, msg: "there is no free doctors" });
    const newAppontment = await Appointments.create({
        pet: petId,
        service,
        appointmentDate: handleAppointmentDate,
        reason,
        doctor: doctorId || freeDoctors[0]._id,
        user: userId,
    });
    return res.status(201).json({
        status: 201, msg: "appointment created successfully",
        data: { newAppontment }
    });
}

export const updateAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const { petId, service, appointmentDate, reason, doctorId, userId } = req.body;
    let appointmentId = req.params.id;
    const appointment = await Appointments.findById(appointmentId);
    if (!appointment) return res.status(400).json({ status: 400, msg: "apppointment not found" });
    const handleAppointmentDate = new Date(appointmentDate);
    handleAppointmentDate.setSeconds(0);
    handleAppointmentDate.setMilliseconds(0);
    const isAppointmentOutOfWorkHours: boolean = isDateOutWorkTime(handleAppointmentDate);
    if (isAppointmentOutOfWorkHours) return res.status(400).json({ status: 400, msg: "appointment date is out of work hours" });
    const freeDoctors: StafInterface[] = await getFreeDoctors(appointmentDate, handleAppointmentDate);
    if (freeDoctors.length === 0) return res.status(409).json({ status: 409, msg: "there is no free doctors" });
    const newAppontment = await Appointments.findByIdAndUpdate(appointmentId, {
        pet: petId,
        service,
        appointmentDate: handleAppointmentDate,
        reason,
        doctor: doctorId || freeDoctors[0]._id,
        user: userId,
    });
    return res.status(201).json({
        status: 201, msg: "appointment updated successfully", data: {
            appontment: newAppontment
        }
    });
}

export const getAppointments = async (req: Request, res: Response, next: NextFunction) => {
    let { page, pageSize, service, doctorId, userId, paymentStatus, petId } = req.query;
    let numberPageSize = pageSize ? Number(pageSize) : 15;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let query: any = {};
    if (service) query.service = service;
    if (userId) query.user = userId;
    if (doctorId) query.doctor = doctorId;
    if (petId) query.pet = petId;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    const appointments = await Appointments.find(query)
        .sort({ appointmentDate: "desc" })
        .skip(skip)
        .limit(numberPageSize)
        .populate({ path: "doctor", select: ['name', 'phoneNumber', 'email', 'role'] })
        .populate({ path: "pet" })
        .populate({ path: "user", select: ['fullName', 'phoneNumber', 'email'] });
    return res.status(200).json({ status: 200, data: { appointments } });
}


export const getAppointmentsById = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    const appointment = await Appointments.findById(id)
        .populate({ path: "doctor", select: ['name', 'phoneNumber', 'email', 'role'] })
        .populate({ path: "pet" })
        .populate({ path: "user", select: ['fullName', 'phoneNumber', 'email'] });
    return res.status(200).json({ status: 200, data: { appointment } });
}

export const deleteAppointments = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    const appointment = await Appointments.findByIdAndDelete(id);
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

export const getAvaliableDoctrs = async (req: Request, res: Response, next: NextFunction) => {
    let { date } = req.query as { date: string };
    const handleAppointmentDate = new Date(date);
    handleAppointmentDate.setSeconds(0);
    handleAppointmentDate.setMilliseconds(0);
    let freeDoctors = await getFreeDoctors(date, handleAppointmentDate);
    return res.status(200).json({ status: 200, data: { doctors: freeDoctors } });
}
