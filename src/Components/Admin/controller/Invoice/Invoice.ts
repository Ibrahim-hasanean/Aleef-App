import { Request, Response, NextFunction } from "express";
import Invoice, { InvoiceInterface } from "../../../../models/Invoice";
import Appointment, { AppointmentsInterface } from "../../../../models/Appointments";

export const addInvoice = async (req: Request, res: Response, next: NextFunction) => {
    let { paymentAmount, reason, appointmentId, userId } = req.body;
    let doctor = req.staff;
    let isAppointmentExist: AppointmentsInterface = await Appointment.findOne({ _id: appointmentId, user: userId }) as AppointmentsInterface;
    if (!isAppointmentExist) {
        return res.status(400).json({ status: 400, msg: `appointment with id ${appointmentId} not exist` });
    }
    let addInvoice: InvoiceInterface = await Invoice.create({
        paymentAmount,
        reason,
        appointment: appointmentId,
        user: userId,
        addedBy: doctor._id
    });
    isAppointmentExist.invoice = [...isAppointmentExist.invoice, addInvoice._id];
    await isAppointmentExist.save();
    return res.status(201).json({ status: 201, msg: "invoice added successfully" });
}

export const getInvoicements = async (req: Request, res: Response, next: NextFunction) => {
    let staffMemeber = req.staff;
    let { appointmentId } = req.query;
    let query: any = {};
    if (appointmentId) query.appointment = appointmentId;
    let invoices: InvoiceInterface[] = await Invoice
        .find(query)
        .populate({ path: "appointment", select: ['appointmentDate', 'reason', 'status'] })
        .populate({ path: "user", select: ['fullName', 'phoneNumber'] })
        .populate({ path: "addedBy", select: ['email', 'phoneNumber', 'name'] });
    return res.status(200).json({ status: 200, data: { invoices } });
}