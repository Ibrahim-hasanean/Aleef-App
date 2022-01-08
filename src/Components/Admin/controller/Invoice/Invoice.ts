import { Request, Response, NextFunction } from "express";
import Invoice, { InvoiceInterface } from "../../../../models/Invoice";
import Appointment, { AppointmentsInterface } from "../../../../models/Appointments";

export const addInvoice = async (req: Request, res: Response, next: NextFunction) => {
    let { paymentAmount, reason, appointmentId } = req.body;
    let user = req.user;
    let isAppointmentExist: AppointmentsInterface = await Appointment.findById(appointmentId) as AppointmentsInterface;
    if (!isAppointmentExist) {
        return res.status(400).json({ status: 400, msg: `appointment with id ${appointmentId} not exist` });
    }
    let addInvoice: InvoiceInterface = await Invoice.create({ paymentAmount, reason, appointment: appointmentId, user: user._id });
    return res.status(201).json({ status: 201, msg: "invoice added successfully" });
}

export const getInvoicements = async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user;
    let { appointmentId } = req.body;
    let query: any = { user: user._id };
    if (appointmentId) query.appointment = appointmentId;
    let invoices: InvoiceInterface[] = await Invoice.find(query);
    return res.status(200).json({ status: 200, data: { invoices } });
}