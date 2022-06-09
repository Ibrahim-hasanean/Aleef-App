import Appointments, { AppointmentsInterface } from "../../../../models/Appointments";
import { Request, Response, NextFunction } from "express";
import { StafInterface } from "../../../../models/Staff";
import getFreeTimes from "../../../utils/getFreeTimes";
import getFreeDoctors from "../../../utils/getFreeDoctors";
import isDateOutWorkTime from "../../../utils/isDateOutWorkTime";
import Pets, { PetsInterface } from "../../../../models/Pets";
import User, { UserInterface } from "../../../../models/User";
import mongoose, { ObjectId } from "mongoose";
import { cancelPayment } from "../../../utils/paymentMethod";

export const addAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const { petId, service, appointmentDate, reason, userId, doctorId, report } = req.body;
    let isPetExist: PetsInterface = await Pets.findOne({ _id: petId, user: userId }) as PetsInterface;
    if (!isPetExist) return res.status(400).json({ status: 400, msg: `pet with id ${petId} not exist` });
    let isUserExist: UserInterface = await User.findById(userId) as UserInterface;
    if (!isUserExist) return res.status(400).json({ status: 400, msg: `user with id ${userId} not exist` });
    const handleAppointmentDate = new Date(appointmentDate);
    handleAppointmentDate.setSeconds(0);
    handleAppointmentDate.setMilliseconds(0);
    // const isAppointmentOutOfWorkHours: boolean = isDateOutWorkTime(handleAppointmentDate);
    // if (isAppointmentOutOfWorkHours) return res.status(400).json({ status: 400, msg: "appointment date is out of work hours" });
    const freeDoctors: StafInterface[] = await getFreeDoctors(appointmentDate, handleAppointmentDate);
    if (freeDoctors.length === 0) return res.status(409).json({ status: 409, msg: "there is no free doctors" });
    const newAppontment = await Appointments.create({
        pet: petId,
        service,
        appointmentDate: handleAppointmentDate,
        reason,
        doctor: doctorId || freeDoctors[0]._id,
        user: userId,
        report
    });
    isPetExist.appointments = [...isPetExist.appointments, newAppontment._id];
    await isPetExist.save();
    return res.status(201).json({
        status: 201, msg: "appointment created successfully",
        data: { newAppontment }
    });
}

export const updateAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const { petId, service, appointmentDate, reason, doctorId, userId, report } = req.body;
    let appointmentId = req.params.id;
    if (!mongoose.isValidObjectId(appointmentId)) return res.status(400).json({ status: 400, msg: `appointmentId ${appointmentId} not valid` });
    if (!mongoose.isValidObjectId(petId)) return res.status(400).json({ status: 400, msg: `petId ${petId} not valid` });
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ status: 400, msg: `userId ${userId} not valid` });
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
        report
    });
    return res.status(201).json({
        status: 201, msg: "appointment updated successfully", data: {
            appontment: newAppontment
        }
    });
}

export const getAppointments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { page, pageSize, service, doctorId, userId, paymentStatus, petId, day, status, appointmentNumber } =
            req.query as
            {
                page: string,
                pageSize: string,
                service: string,
                doctorId: string,
                userId: string,
                paymentStatus: string,
                petId: string,
                day: string,
                status: string,
                appointmentNumber: string,
            };
        let numberPageSize = pageSize ? Number(pageSize) : 15;
        let skip = (Number(page || 1) - 1) * numberPageSize;
        let query: any = {};
        if (service) query.service = service;
        if (userId && mongoose.isValidObjectId(userId)) query.user = userId;
        else if (userId) return res.status(400).json({ status: 400, msg: `userId ${userId} not valid` });
        if (doctorId && mongoose.isValidObjectId(doctorId)) query.doctor = doctorId;
        else if (doctorId) return res.status(400).json({ status: 400, msg: `doctorId ${doctorId} not valid` });
        if (petId && mongoose.isValidObjectId(petId)) query.pet = petId;
        else if (petId) return res.status(400).json({ status: 400, msg: `petId ${petId} not valid` });
        if (paymentStatus) query.paymentStatus = paymentStatus;
        if (appointmentNumber) query.appointmentNumber = appointmentNumber;
        if (day) {
            let beginDay = new Date(day);
            beginDay.setUTCHours(0);
            beginDay.setMinutes(0);
            beginDay.setUTCMilliseconds(0);
            let endDay = new Date(day);
            endDay.setUTCHours(24);
            endDay.setMinutes(0);
            endDay.setUTCMilliseconds(0);
            query.appointmentDate = { $gte: beginDay, $lte: endDay }
            console.log(query)
        }
        if (status) query.status = status;
        const appointments = await Appointments.find(query)
            .sort({ appointmentDate: "desc" })
            .skip(skip)
            .limit(numberPageSize)
            .populate({ path: "doctor" })
            .populate({ path: "pet" })
            .populate({ path: "user" });
        const appointmentsCount = await Appointments.find(query).count();
        return res.status(200).json({ status: 200, data: { appointments, page: page || 1, limit: pageSize || 10, appointmentsCount } });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ status: 500, msg: error.message })
    }
}


export const getAppointmentsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id = req.params.id;
        const appointment: AppointmentsInterface = await Appointments.findById(id)
            .populate({ path: "doctor" })//select: ['name', 'phoneNumber', 'email', 'role']
            .populate({
                path: "pet",
                populate: {
                    path: 'medacins vaccinations',
                    options: { sort: { createdAt: "desc" } }
                },
            })//select: ['name', 'serialNumber', 'age', 'gender', 'imageUrl', 'notes']
            .populate({ path: "medacin" })
            .populate({ path: "user", }) as AppointmentsInterface;// select: ['fullName', 'phoneNumber', 'email']
        let lastCheckUp = '';
        let lastAppointments: AppointmentsInterface[] = await Appointments
            .find({ pet: appointment.pet })
            .sort({ appointmentDate: "desc" })
            .limit(10).select(["service", "appointmentDate", "doctor", 'reason']).populate({
                path: "doctor",
                select: ['name', 'phoneNumber'],
            });
        let pet: PetsInterface = appointment.pet as PetsInterface;
        if (pet) {
            let lastAppointment: AppointmentsInterface[] = await Appointments
                .find({ pet: pet._id, appointmentDate: { $lte: new Date() } })
                .sort({ appointmentDate: "desc" })
                .limit(1);
            lastCheckUp = String(lastAppointment[0]?.appointmentDate || '');
        } else {
            return res.status(200).json({ status: 200, data: { appointment: null } });
        }
        return res.status(200).json({
            status: 200,
            data: {
                appointment: {
                    ...appointment?.toJSON(),
                    pet: {
                        ...pet.toJSON(),
                        lastCheckUp,
                        medicalRecord: lastAppointments,
                    }
                },
            }
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ status: 500, msg: error.message })
    }
}


export const deleteAppointments = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ status: 400, msg: "appointmentId not found" });
    }
    const appointment: AppointmentsInterface = await Appointments.findOne({ _id: id }) as AppointmentsInterface;
    if (!appointment) return res.status(400).json({ status: 400, msg: "appointment not found" });
    appointment.status = "cancelled";
    if (appointment.paymentChargeId) {
        await cancelPayment(appointment.paymentChargeId);
    }
    await appointment.save()
    return res.status(200).json({ status: 200, msg: "appointment cancelled successfully" });

}

export const getAvaliableTime = async (req: Request, res: Response, next: NextFunction) => {
    let { day } = req.query as { day: string };
    const handleAppointmentDate = new Date(day);
    // handleAppointmentDate.setMinutes(0);
    // handleAppointmentDate.setSeconds(0);
    // handleAppointmentDate.setMilliseconds(0);
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

export const userAppointments = async (req: Request, res: Response, next: NextFunction) => {
    let userId: string = req.params.id;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ status: 400, msg: `userId ${userId} not valid` });
    let { page, pageSize, } = req.query;
    let numberPageSize = pageSize ? Number(pageSize) : 15;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let user: UserInterface = await User.findById(userId).select(['fullName', 'phoneNumber', 'email', 'imageUrl']) as UserInterface;
    if (!user) return res.status(400).json({ status: 400, msg: `user with id ${userId} not found` });
    let userAppointments: AppointmentsInterface[] = await Appointments.find({ user: user._id })
        .skip(skip)
        .limit(numberPageSize)
        .populate({ path: "doctor", select: ['name', 'phoneNumber', 'email', 'role'] })
        .populate({ path: "pet", select: ['name', 'serialNumber', 'age'] });
    return res.status(200).json({ status: 200, data: { user, appointments: userAppointments } });
}

export const addReportToAppointment = async (req: Request, res: Response, next: NextFunction) => {
    let { report } = req.body;
    if (!report) return res.status(400).json({ status: 400, msg: "report is required" });
    let appointmentId = req.params.id;
    if (!mongoose.isValidObjectId(appointmentId)) return res.status(400).json({ status: 400, msg: `appointmentId ${appointmentId} not valid` });
    let isAppointmentExist: AppointmentsInterface = await Appointments.findById(appointmentId) as AppointmentsInterface;
    if (!isAppointmentExist) return res.status(400).json({ status: 400, msg: `there not appointment with id ${appointmentId}` });
    isAppointmentExist.report = report;
    await isAppointmentExist.save();
    return res.status(200).json({ status: 200, data: { report } });
}

export const deleteReportToAppointment = async (req: Request, res: Response, next: NextFunction) => {
    let appointmentId = req.params.id;
    if (!mongoose.isValidObjectId(appointmentId)) return res.status(400).json({ status: 400, msg: `appointmentId ${appointmentId} not valid` });
    let isAppointmentExist: AppointmentsInterface = await Appointments.findById(appointmentId) as AppointmentsInterface;
    if (!isAppointmentExist) return res.status(400).json({ status: 400, msg: `there not appointment with id ${appointmentId}` });
    isAppointmentExist.report = '';
    await isAppointmentExist.save();
    return res.status(200).json({ status: 200, msg: "report deleted successfully" });
}