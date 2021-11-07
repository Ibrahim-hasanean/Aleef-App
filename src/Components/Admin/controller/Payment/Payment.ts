import Payment, { PaymentInterFace } from "../../../../models/Payment";
import User, { UserInterface } from "../../../../models/User";
import { NextFunction, Request, Response } from "express";

export const addPayment = async (req: Request, res: Response, next: NextFunction) => {
    let { totalAmount, discount, paymentAmmount, exchange, paymentType, userId } = req.body;
    const isUserExist: UserInterface = await User.findById(userId);
    if (!isUserExist) return res.status(400).json({ status: 400, msg: `user with userId ${userId} not found` });
    let newPayment: PaymentInterFace = await Payment.create({ totalAmount, discount, paymentAmmount, exchange, paymentType, user: userId })
    return res.status(201).json({ status: 201, msg: "payment success", data: { payment: newPayment } });
}

export const updatePayment = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params;
    let { totalAmount, discount, paymentAmmount, exchange, paymentType, userId } = req.body;
    const isUserExist: UserInterface = await User.findById(userId);
    if (!isUserExist) return res.status(400).json({ status: 400, msg: `user with userId ${userId} not found` });
    let newPayment: PaymentInterFace = await Payment.findByIdAndUpdate(id, { totalAmount, discount, paymentAmmount, exchange, paymentType, user: userId })
    return res.status(201).json({ status: 201, msg: "payment success", data: { payment: newPayment } });
}

export const getPayments = async (req: Request, res: Response, next: NextFunction) => {
    let { page, pageSize, userId, paymentType } = req.query;
    let query: any = {};
    let numberPageSize = pageSize ? Number(pageSize) : 15;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    if (userId) query.user = userId;
    if (paymentType) query.paymentType = paymentType;
    let payments: PaymentInterFace[] = await Payment.find(query).skip(skip).limit(numberPageSize).populate("user");
    return res.status(200).json({ status: 200, data: { payments } });
}

export const getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let payment: PaymentInterFace[] = await Payment.findById(id).populate("user");
    return res.status(200).json({ status: 200, data: { payment } });
}

export const deletePayment = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let payment: PaymentInterFace[] = await Payment.findByIdAndDelete(id);
    return res.status(200).json({ status: 200, data: { payment } });
}



