import Payment, { PaymentInterFace } from "../../../../models/Payment";
import User, { UserInterface } from "../../../../models/User";
import { NextFunction, Request, Response } from "express";
import Appointments, { AppointmentsInterface } from "../../../../models/Appointments";

export const addAppointmentsPayment = async (req: Request, res: Response, next: NextFunction) => {
    let { totalAmount, discount, paymentAmmount, exchange, paymentType, userId, appointmentId } = req.body;
    const isUserExist: UserInterface | null = await User.findById(userId);
    if (!isUserExist) return res.status(400).json({ status: 400, msg: `user with userId ${userId} not found` });
    const isAppoitmentExist: AppointmentsInterface | null = await Appointments.findById(appointmentId);
    if (!isAppoitmentExist) return res.status(400).json({ status: 400, msg: `appointment with appointmentId ${appointmentId} not found` });
    let newPayment: PaymentInterFace = await Payment.create({
        totalAmount, discount, paymentAmmount,
        exchange, paymentType, user: userId, appointment: appointmentId
    });
    isAppoitmentExist.payment = newPayment._id;
    await isAppoitmentExist.save();
    return res.status(201).json({ status: 201, msg: "payment success", data: { payment: newPayment } });
}

export const updateAppointmentsPayment = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params;
    const isPaymentExist = await Payment.findById(id);
    if (!isPaymentExist) return res.status(400).json({ status: 400, msg: `payment with paymentId ${id} not found` });
    let { totalAmount, discount, paymentAmmount, exchange, paymentType, userId, appointmentId } = req.body;
    const isUserExist: UserInterface | null = await User.findById(userId);
    if (!isUserExist) return res.status(400).json({ status: 400, msg: `user with userId ${userId} not found` });
    const isAppoitmentExist: AppointmentsInterface | null = await Appointments.findById(appointmentId);
    if (!isAppoitmentExist) return res.status(400).json({ status: 400, msg: `appointment with appointmentId ${appointmentId} not found` });
    let newPayment: PaymentInterFace = await Payment.findByIdAndUpdate(id,
        { totalAmount, discount, paymentAmmount, exchange, paymentType, user: userId, appointment: appointmentId }
    ) as PaymentInterFace;
    isAppoitmentExist.payment = newPayment._id;
    await isAppoitmentExist.save();
    return res.status(201).json({ status: 201, msg: "payment success", data: { payment: newPayment } });
}

export const getAppointmentsPayments = async (req: Request, res: Response, next: NextFunction) => {
    let { page, pageSize, userId, paymentType } = req.query;
    let query: any = {};
    let numberPageSize = pageSize ? Number(pageSize) : 15;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    if (userId) query.user = userId;
    if (paymentType) query.paymentType = paymentType;
    let payments: PaymentInterFace[] = await Payment.find(query).skip(skip).limit(numberPageSize).populate("user");
    return res.status(200).json({ status: 200, data: { payments } });
}

export const getAppointmentsPaymentById = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let payment: PaymentInterFace | null = await Payment.findById(id).populate("user");
    return res.status(200).json({ status: 200, data: { payment } });
}

export const deleteAppointmentsPayment = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let payment: PaymentInterFace | null = await Payment.findByIdAndDelete(id);
    if (payment?.appointment) {
        const apppointment: AppointmentsInterface = await Appointments.findById(payment.appointment) as AppointmentsInterface;
        apppointment.payment = null;
        await apppointment.save();
    }
    return res.status(200).json({ status: 200, data: { payment } });
}



