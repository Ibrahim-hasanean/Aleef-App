import { NextFunction, Request, Response } from "express";
import User from "../../../../models/User";
import Appointments from "../../../../models/Appointments";
import Order from "../../../../models/Order";
import Payment from "../../../../models/Payment";
import HealthCare from "../../../../models/HealthCare";
export const adminHome = async (req: Request, res: Response, next: NextFunction) => {
    let { from, to } = req.query as { from: string, to: string };
    let fromDate = new Date(from);
    let toDate = new Date(to);
    let query: any = {};
    let appointmentsQuery: any = {};
    if (from || to) {
        query.createdAt = {};
        if (from) {
            query.createdAt = { ...query.createdAt, $gte: fromDate };
            appointmentsQuery.appointmentDate = { $gte: fromDate };
        }
        if (to) {
            query.createdAt = { ...query.createdAt, $lte: toDate };
            appointmentsQuery.appointmentDate = { $lte: toDate }
        }
    }
    const totalClients = await User.count();
    const totalAppointments = await Appointments.find(appointmentsQuery).count();
    const totalOrders = await Order.count();
    let storeRevenueSum = await Order.aggregate([
        { $match: query },
        { $group: { _id: null, storeRevenue: { $sum: '$totalPrice' } } }
    ]);
    let clinicRevenueSum = await Payment.
        aggregate([
            { $match: { appointment: { $ne: null }, ...query } },
            { $group: { _id: null, clinicRevenue: { $sum: '$totalAmount' } } }
        ]);

    const storeRevenue = storeRevenueSum[0] ? storeRevenueSum[0].storeRevenue : 0;
    const clinicRevenue = clinicRevenueSum[0] ? clinicRevenueSum[0].clinicRevenue : 0;
    let newOrders = await Order
        .find()
        .sort({ createdAt: "desc" })
        .populate({
            path: "items",
            populate: {
                path: "item",
                // match: { name: { "$regex": text || "", "$options": "i" } } 
            }
        })
        .populate({ path: "user", select: ['fullName', 'phoneNumber', 'email'] })
        .limit(10);
    let newAppointments = await Appointments
        .find()
        .sort({ appointmentDate: "desc" })
        .populate({ path: "user", select: ['fullName', 'phoneNumber', 'email'] })
        .populate("pet")
        .limit(10);
    const healthCare = await HealthCare.find();
    return res.status(200).json({
        status: 200,
        data: {
            totalClients,
            totalAppointments,
            totalOrders,
            storeRevenue,
            clinicRevenue,
            totalRevenue: storeRevenue + clinicRevenue,
            healthCare: healthCare[0],
            newOrders,
            newAppointments,

        }
    })
}