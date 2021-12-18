import { NextFunction, Request, Response } from "express";
import Appointments, { AppointmentsInterface } from "../../../models/Appointments";
import { StafInterface } from "../../../models/Staff";
import getFreeTimes from "../../utils/getFreeTimes";
import getFreeDoctors from "../../utils/getFreeDoctors";
import isDateOutWorkTime from "../../utils/isDateOutWorkTime";
import Payment, { PaymentInterFace } from "../../../models/Payment";
import mongoose from "mongoose";
import Pets, { PetsInterface } from "../../../models/Pets";
import { PetsVaccination } from "../../../models/Vaccination";

export const addAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const { petId, service, appointmentDate, reason } = req.body;
    const user = req.user;
    let isPetExist: PetsInterface = await Pets.findOne({ _id: petId, user: user._id }) as PetsInterface;
    if (!isPetExist) return res.status(400).json({ status: 400, msg: `pet with id ${petId} not exist` });
    const handleAppointmentDate = new Date(appointmentDate);
    handleAppointmentDate.setSeconds(0);
    handleAppointmentDate.setMilliseconds(0);
    let nowDate = new Date();
    if (handleAppointmentDate < nowDate) return res.status(400).json({ status: 400, msg: "can not book appointment in past time" });
    const isAppointmentOutOfWorkHours: boolean = isDateOutWorkTime(handleAppointmentDate);
    if (isAppointmentOutOfWorkHours) return res.status(400).json({ status: 400, msg: "appointment date is out of work hours" });
    const freeDoctors: StafInterface[] = await getFreeDoctors(appointmentDate, handleAppointmentDate);
    if (freeDoctors.length === 0) return res.status(409).json({ status: 409, msg: "there is no free doctors" });
    const newAppontment = await Appointments.create({
        pet: petId,
        service,
        appointmentDate: handleAppointmentDate,
        reason,
        doctor: freeDoctors[0]._id,
        user: user._id,
        status: "upcoming"
    });
    isPetExist.appointments = [...isPetExist.appointments, newAppontment._id];
    await isPetExist.save();
    return res.status(201).json({
        status: 201, msg: "appointment created successfully",
        data: { newAppontment }
    });
}

export const updateAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const { petId, service, appointmentDate, reason, doctorId } = req.body;
    const user = req.user;
    let appointmentId = req.params.id;
    if (!mongoose.isValidObjectId(appointmentId)) {
        return res.status(400).json({ status: 400, msg: "appointment not  found" });
    }
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
        service,
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
    let { page, pageSize, service, doctorId, paymentStatus, petId, status, day, } =
        req.query as {
            page: string,
            pageSize: string,
            service: string,
            doctorId: string,
            paymentStatus: string,
            petId: string,
            status: string,
            day: string,
        };
    let numberPageSize = pageSize ? Number(pageSize) : 15;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let user = req.user;
    let query: any = { user: user._id };
    if (service) query.service = service;
    if (doctorId) query.doctor = doctorId;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (petId) query.pet = petId;
    if (status) query.status = status;
    if (day) {
        let beginDay = new Date(day)
        beginDay.setHours(1);
        beginDay.setMinutes(0);
        let endDay = day ? new Date(day) : new Date();
        endDay.setHours(24);
        endDay.setMinutes(0);
        query.appointmentDate = { $gte: beginDay, $lte: endDay }
    }
    const appointments = await Appointments.find(query)
        .populate("doctor")
        .populate("pet")
        .sort({ appointmentDate: "desc" })
        .skip(skip)
        .limit(numberPageSize);
    return res.status(200).json({ status: 200, data: { appointments } });
}

export const getAppointmentsById = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let user = req.user;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(200).json({ status: 200, data: { appointment: null } });
    }
    const appointment = await Appointments.findOne({ _id: id, user: user._id })
        .populate("doctor")
        .populate("pet")
        .populate("medacin");
    return res.status(200).json({ status: 200, data: { appointment } });
}

export const deleteAppointments = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let user = req.user;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ status: 400, msg: "appointmentId not found" });
    }
    const appointment: AppointmentsInterface = await Appointments.findOne({ _id: id, user: user._id }) as AppointmentsInterface;
    if (!appointment) return res.status(400).json({ status: 400, msg: "appointment not found" });
    appointment.status = "cancelled";
    await appointment.save()
    return res.status(200).json({ status: 200, msg: "appointment cancelled successfully" });
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

export const payAppointment = async (req: Request, res: Response, next: NextFunction) => {
    let { totalAmount, discount, paymentAmmount, exchange, appointmentId } = req.body;
    let user = req.user;
    const isAppointmentExist: AppointmentsInterface | null = await Appointments.findById(appointmentId);
    if (!isAppointmentExist) return res.status(400).json({ status: 400, msg: `appointment with id ${appointmentId} not exist` })
    let newPayment: PaymentInterFace = await Payment.create({
        totalAmount,
        discount,
        paymentAmmount,
        exchange,
        paymentType: "visa",
        user: user._id,
        appointment: appointmentId
    })
    isAppointmentExist.payment = newPayment._id;
    isAppointmentExist.paymentStatus = "Completed";
    await isAppointmentExist.save();
    return res.status(201).json({ status: 201, msg: "payment success", data: { payment: newPayment } });
}

export const getAppointmentPayments = async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user;
    let query = { user: user._id };
    let payments: PaymentInterFace[] = await Payment.find(query);
    return res.status(200).json({ status: 200, data: { payments } });
}

export const getAppointmentPaymentById = async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user;
    let id = req.params.id;
    let query = { user: user._id, _id: id };
    let payment: PaymentInterFace | null = await Payment.findOne(query);
    return res.status(200).json({ status: 200, data: { payment } });
}

export const getReminder = async (req: Request, res: Response, next: NextFunction) => {
    let { page, limit, day } = req.query as { page: string, limit: string, day: string, };
    let user = req.user;
    let numberPageSize = limit ? Number(limit) : 2;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let beginDay = day ? new Date(day) : new Date();
    beginDay.setHours(1);
    beginDay.setMinutes(0);
    let endDay = day ? new Date(day) : new Date();
    endDay.setHours(24);
    endDay.setMinutes(0);
    console.log(beginDay)
    console.log(endDay)
    let pets = await Pets.find({ user: user._id })
        .populate({
            path: "appointments",
            select: "appointmentDate",
            match: { appointmentDate: { $gte: beginDay, $lte: endDay } },
            options: {
                sort: { appointmentDate: "asc" },
            },
            limit: 1
        })
        .populate({
            path: "vaccinations",
            select: "dates",
            match: { dates: { $elemMatch: { $gte: beginDay, $lte: endDay } } },
        });

    const nextVaccination = pets
        .filter(x => x.vaccinations.length > 0)
        .map(pet => ({
            name: pet.name,
            date: pet.vaccinations
                .map((x) => {
                    let vacination: PetsVaccination = x as PetsVaccination;
                    return vacination.dates;
                })
                .flat()
                .filter(x => new Date(x) > beginDay && new Date(x) < endDay)
                .sort((x: Date, b: Date) => (new Date(x).getTime() - new Date(b).getTime()))[0]
        }));

    let nextAppontments = pets.filter(x => x.appointments.length > 0).map(pet => ({ name: pet.name, date: pet.appointments[0] }));

    return res.status(200).json({ status: 200, data: { nextVaccination, nextAppontments, pets } });
}