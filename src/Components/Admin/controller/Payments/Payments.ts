import { Request, Response, NextFunction } from "express";
import Payment, { PaymentInterFace } from "../../../../models/Payment";
import User, { UserInterface } from "../../../../models/User";

export const getPayments = async (req: Request, res: Response, next: NextFunction) => {
    let { page, limit, paymentType, text, from, to } = req.query as { page: string, limit: string, paymentType: string, userId: string, text: string, from: string, to: string }
    let query: any = {};
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    if (paymentType) query.paymentType = paymentType;
    if (text) {
        const users: UserInterface[] = await User.find({ fullName: { "$regex": text, "$options": "i" } }).select("_id");
        const usersId = users.map(x => x._id);
        query = { ...query, user: { $in: usersId } }
    }
    if (from || to) {
        query.createdAt = {}
    }
    if (from) {
        const handleFromDate = new Date(from);
        handleFromDate.setSeconds(0);
        handleFromDate.setMilliseconds(0);
        handleFromDate.setMinutes(0);
        handleFromDate.setHours(1);
        query = { ...query, createdAt: { $gte: handleFromDate } };
    }
    if (to) {
        const handleToDate = new Date(to);
        handleToDate.setSeconds(0);
        handleToDate.setMilliseconds(0);
        handleToDate.setMinutes(59);
        handleToDate.setHours(23);
        query = { ...query, createdAt: { ...query.createdAt, $lte: handleToDate } };
    }
    let payments: PaymentInterFace[] = await Payment
        .find(query)
        .sort({ createdAt: "descending" })
        .skip(skip)
        .limit(limitNumber)
        .populate({ path: "appointment", select: ['service', 'appointmentDate', 'reason'] })
        .populate({ path: "user", select: ['fullName', 'email', 'phoneNumber'] })
        .populate({ path: "order", select: ['totalPrice', 'itemsCount', 'shippingFees', 'shippingAddress'] });
    return res.status(200).json({ status: 200, data: { payments } });
}

export const getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let payment: PaymentInterFace | null = await Payment.findById(id)
        .populate({ path: "appointment", select: ['service', 'appointmentDate', 'reason'] })
        .populate({ path: "user", select: ['fullName', 'email', 'phoneNumber'] })
        .populate({ path: "order", select: ['totalPrice', 'itemsCount', 'shippingFees', 'shippingAddress'] });
    return res.status(200).json({ status: 200, data: { payment } });
}