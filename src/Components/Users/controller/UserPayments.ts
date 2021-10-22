import { NextFunction, Request, Response } from "express";
import OrderItem, { OrdersItemsInterface } from "../../../models/OrderItems";
import Order, { OrderInterface } from "../../../models/Order";
import caculateItemsPrice from "../../utils/calculateItemsPrice";

export const payItem = async (req: Request, res: Response, next: NextFunction) => {
    const { totalPrice, itemsCount, shippingFees, shippingAddressId, cardNumber, orderItems } = req.body;
    const user = req.user;
    const orderItemsTotal = await caculateItemsPrice(orderItems);
    console.log(totalPrice)
    console.log(orderItemsTotal);
    if (totalPrice != orderItemsTotal.totalCost) {
        return res.status(400).json({ status: 400, msg: "totalPrice not equal all items total price" });
    }
    if (shippingFees != orderItemsTotal.shippingCost) {
        return res.status(400).json({ status: 400, msg: "shippingFees not equal all items total shipping fees" });
    }
    //payment 
    const orderItemsCollection = await OrderItem.create(...orderItems);
    const newOrder = await Order.create({ user: user._id, totalPrice, itemsCount, items: orderItemsCollection, shippingFees, shippingAddress: shippingAddressId, cardNumber });
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
    let userOrders = await Order.findById(paymentsId).populate({ path: "items", populate: { path: "item" } });
    return res.status(200).json({ status: 200, data: { order: userOrders } });
}

