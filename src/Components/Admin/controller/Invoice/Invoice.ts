import { Request, Response, NextFunction } from "express";
import Invoice, { InvoiceInterface } from "../../../../models/Invoice";
import Appointment, { AppointmentsInterface } from "../../../../models/Appointments";

export const doctorAddInvoice = async (req: Request, res: Response, next: NextFunction) => {
    let { totalAmount, appointmentId } = req.body;
    console.log(totalAmount, appointmentId);
    let doctor = req.staff;
    let isAppointmentExist: AppointmentsInterface = await Appointment.findById(appointmentId) as AppointmentsInterface;
    if (!isAppointmentExist) {
        return res.status(400).json({ status: 400, msg: `appointment with id ${appointmentId} not exist` });
    }
    let addInvoice: InvoiceInterface = await Invoice.create({
        totalAmount,
        paymentAmount: 0,
        appointment: appointmentId,
        user: isAppointmentExist.user,
        addedBy: doctor._id
    });
    isAppointmentExist.invoice = [...isAppointmentExist.invoice, addInvoice._id];
    isAppointmentExist.totalAmount = (isAppointmentExist.totalAmount || 0) + totalAmount;
    await isAppointmentExist.save();
    return res.status(201).json({ status: 201, msg: "invoice added successfully" });
}

export const addInvoice = async (req: Request, res: Response, next: NextFunction) => {
    let { paymentAmount, discount, appointmentId } = req.body;
    let doctor = req.staff;
    let isAppointmentExist: AppointmentsInterface = await Appointment.findById(appointmentId) as AppointmentsInterface;
    if (!isAppointmentExist) {
        return res.status(400).json({ status: 400, msg: `appointment with id ${appointmentId} not exist` });
    }
    let addInvoice: InvoiceInterface = await Invoice.create({
        paymentAmount,
        totalAmount: isAppointmentExist.totalAmount,
        appointment: appointmentId,
        user: isAppointmentExist.user,
        addedBy: doctor._id,
        discount
    });
    isAppointmentExist.invoice = [...isAppointmentExist.invoice, addInvoice._id];
    let appointmentInvoices = await Invoice.find({ appointment: isAppointmentExist._id });
    let invoicesSum = appointmentInvoices.map(x => x.paymentAmount).reduce((a, b) => a + b, 0);
    let discountSum = appointmentInvoices.map(x => x.discount).reduce((a, b) => a + b, 0);
    if (typeof isAppointmentExist.totalAmount == "number" && invoicesSum >= isAppointmentExist.totalAmount - discountSum) {
        isAppointmentExist.paymentStatus = "Completed";
    }
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