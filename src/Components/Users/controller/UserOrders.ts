import { NextFunction, Request, Response } from "express";
import OrderItem, { OrdersItemsInterface } from "../../../models/OrderItems";
import Order, { OrderInterface } from "../../../models/Order";
import caculateItemsPrice from "../../utils/calculateItemsPrice";
import Payment, { PaymentInterFace } from "../../../models/Payment";
import mongoose from "mongoose";
import { paymentMethod, cancelPayment } from "../../utils/paymentMethod";

export const payItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            totalPrice,
            itemsCount,
            shippingFees,
            shippingAddressId,
            orderItems,
            currency,
            paymentType,
            stripeToken
        } = req.body;
        const user = req.user;
        let orderItemsTotal;
        try {
            orderItemsTotal = await caculateItemsPrice(orderItems);
        } catch (error: any) {
            return res.status(400).json({ status: 400, msg: error.message });
        }
        if (totalPrice != orderItemsTotal.totalCost) {
            return res.status(400).json({ status: 400, msg: "totalPrice not equal all items total price" });
        }
        if (shippingFees != orderItemsTotal.shippingCost) {
            return res.status(400).json({ status: 400, msg: "shippingFees not equal all items total shipping fees" });
        }
        if (paymentType == "card" && !stripeToken) {
            return res.status(400).json({ status: 400, msg: "payment type card require stripe token" });
        }
        const orderItemsCollection = await OrderItem.create(...orderItems);
        const newOrder: OrderInterface = new Order({
            user: user._id,
            totalPrice,
            itemsCount,
            items: orderItemsCollection,
            subTotal: totalPrice - shippingFees,
            shippingFees,
            shippingAddress: shippingAddressId,
            currency,
            status: "to be shipped",
            paymentType
        });
        // online payment
        const payment: PaymentInterFace = new Payment({
            totalAmount: totalPrice, paymentAmmount: totalPrice, paymentType: paymentType == "card" ? "visa" : paymentType, user: user._id, order: newOrder._id
        })
        if (paymentType == "card") {
            let paymentCharge = await paymentMethod(stripeToken, totalPrice, currency, `new order payment order id ${newOrder._id}`);
            payment.paymentChargeId = paymentCharge.id;
            newOrder.payment = payment._id;
            newOrder.paymentChargeId = paymentCharge.id;
            await payment.save();
        }
        await newOrder.save();
        await payment.save();
        return res.status(200).json({ status: 200, data: { order: newOrder } });
    } catch (error: any) {
        return res.status(400).json({ status: 400, msg: error.message ?? error });
    }
}

export const getPayments = async (req: Request, res: Response, next: NextFunction) => {
    let { page, limit, status, from, to } = req.query as { page: string, limit: string, status: string, from: string, to: string };
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let user = req.user;
    let query: any = { user: user._id };
    if (status) query.status = status;
    if (from || to) query.createdAt = {}
    if (to) {
        let date = new Date(to);
        date.setHours(23);
        date.setMinutes(59);
        query.createdAt.$lte = date;
    }
    if (from) query.createdAt.$gte = new Date(from);
    console.log(query)
    let userOrders = await Order
        .find(query)
        .sort({ createdAt: "desc" })
        .populate({ path: "items", populate: { path: "item" } })
        .skip(skip)
        .limit(limitNumber);
    return res.status(200).json({ status: 200, data: { orders: userOrders } });
}

export const getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user;
    let paymentsId = req.params.id;
    if (!mongoose.isValidObjectId(paymentsId)) {
        return res.status(200).json({ status: 200, data: { order: null } });
    }
    let userOrders = await Order.findById(paymentsId).populate({ path: "items", populate: { path: "item" } });
    return res.status(200).json({ status: 200, data: { order: userOrders } });
}

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user;
    let paymentsId = req.params.id;
    // let { paymentChargeId } = req.body;
    if (!mongoose.isValidObjectId(paymentsId)) {
        return res.status(400).json({ status: 400, msg: "order not found" });
    }
    let userOrder: OrderInterface = await Order.findOne({ user: user._id, _id: paymentsId }) as OrderInterface;
    if (!userOrder) return res.status(400).json({ status: 400, msg: "order not found" });
    if (userOrder.status == "shipped") return res.status(400).json({ status: 400, msg: "can not cancel order , order is shipped" });
    if (userOrder.paymentChargeId)
        await cancelPayment(userOrder.paymentChargeId);
    userOrder.status = "canceled";
    // if (paymentIntent) {
    //     await cancelPayment(paymentIntent)
    // }
    await userOrder.save();
    return res.status(200).json({ status: 200, data: { order: userOrder } });
}


