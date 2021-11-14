import { NextFunction, Request, Response } from "express";
import Appointments, { AppointmentsInterface } from "../../../models/Appointments";
import { StafInterface } from "../../../models/Staff";
import getFreeTimes from "../../utils/getFreeTimes";
import getFreeDoctors from "../../utils/getFreeDoctors";
import isDateOutWorkTime from "../../utils/isDateOutWorkTime";
import Payment, { PaymentInterFace } from "../../../models/Payment";
import mongoose from "mongoose";

export const addAppointment = async (req: Request, res: Response, next: NextFunction) => {
    const { petId, service, appointmentDate, reason } = req.body;
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
        service,
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
    let { page, pageSize, service, doctorId, paymentStatus } = req.query;
    let numberPageSize = pageSize ? Number(pageSize) : 15;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let user = req.user;
    let query: any = { user: user._id };
    if (service) query.service = service;
    if (doctorId) query.doctor = doctorId;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    const appointments = await Appointments.find(query)
        .populate("doctor")
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
    const appointment = await Appointments.findOne({ _id: id, user: user._id });
    return res.status(200).json({ status: 200, data: { appointment } });
}

export const deleteAppointments = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let user = req.user;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(200).json({ status: 200, msg: "appointment deleted successfully" });
    }
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