import { NextFunction, Request, Response } from "express";
import OrderItem, { OrdersItemsInterface } from "../../../models/OrderItems";
import Order, { OrderInterface } from "../../../models/Order";
import caculateItemsPrice from "../../utils/calculateItemsPrice";
import Payment, { PaymentInterFace } from "../../../models/Payment";
import mongoose from "mongoose";

export const payItem = async (req: Request, res: Response, next: NextFunction) => {
    const { totalPrice, itemsCount, shippingFees, shippingAddressId, cardNumber, orderItems } = req.body;
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
    //payment 
    const orderItemsCollection = await OrderItem.create(...orderItems);
    const newOrder: OrderInterface = new Order({
        user: user._id,
        totalPrice,
        itemsCount,
        items: orderItemsCollection,
        shippingFees,
        shippingAddress: shippingAddressId,
        cardNumber,
        status: "pending"
    });
    const payment: PaymentInterFace = new Payment({ totalAmount: totalPrice, paymentAmmount: totalPrice, paymentType: "visa", user: user._id, order: newOrder._id })
    newOrder.payment = payment._id;
    await newOrder.save();
    await payment.save();
    return res.status(200).json({ status: 200, data: { order: newOrder } });
}

export const getPayments = async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user;
    let userOrders = await Order.find({ user: user._id }).populate({ path: "items", populate: { path: "item" } });
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
    if (!mongoose.isValidObjectId(paymentsId)) {
        return res.status(400).json({ status: 400, msg: "order not found" });
    }
    let userOrders = await Order.findOneAndUpdate({ user: user._id, _id: paymentsId }, { status: "canceled" });
    return res.status(200).json({ status: 200, data: { order: userOrders } });
}


