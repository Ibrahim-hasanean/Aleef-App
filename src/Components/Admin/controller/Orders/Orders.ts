import { NextFunction, Request, Response } from "express";
import Order, { OrderInterface } from "../../../../models/Order";
import Payment, { PaymentInterFace } from "../../../../models/Payment";
import caculateItemsPrice from "../../../utils/calculateItemsPrice";
import OrderItem, { OrdersItemsInterface } from "../../../../models/OrderItems";
import User, { UserInterface } from "../../../../models/User";
import Item, { ItemInterface } from "../../../../models/Item";

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    let { status, from, to, page, limit, text } = req.query as { status: string, from: string, to: string, page: string, limit: string, text: string }
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let query: any = {};
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
    if (status) query.status = status;
    if (text) {
        // query = { ...query, "user.fullName": { "$regex": text || "", "$options": "i" } };
        const users: UserInterface[] = await User.find({ fullName: { "$regex": text, "$options": "i" } }).select("_id");
        const usersId = users.map(x => x._id);
        const items: ItemInterface[] = await Item.find({ name: { "$regex": text, "$options": "i" } });
        const itemsId: OrdersItemsInterface[] = items.map(x => x._id);
        const ordersItems = await OrderItem.find({ item: { $in: itemsId } }).select("_id");
        const ordersItemsId = ordersItems.map(x => x._id);
        query = { ...query, $or: [{ user: { $in: usersId } }, { items: { $in: ordersItemsId } }] };
    }
    let orders = await Order
        .find(query)
        .sort({ createdAt: "desc" })
        .populate({
            path: "items",
            populate: {
                path: "item",
                // match: { name: { "$regex": text || "", "$options": "i" } } 
            }
        })
        .populate({ path: "user", select: ['fullName', 'phoneNumber', 'email'] })
        .skip(skip)
        .limit(limitNumber)
        .exec();
    return res.status(200).json({ status: 200, data: { orders } });
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let order = await Order.findById(id).populate("items");
    return res.status(200).json({ status: 200, data: { order } });
}

export const setStatus = async (req: Request, res: Response, next: NextFunction) => {
    let { status } = req.body;
    let id = req.params.id;
    let order: OrderInterface = await Order.findByIdAndUpdate(id, { status }) as OrderInterface;
    return res.status(200).json({ status: 200, data: { order } });
}

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let order = await Order.findByIdAndDelete(id);
    return res.status(200).json({ status: 200, data: { order } });
}

export const addOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { totalPrice, itemsCount, shippingFees, shippingAddressId, cardNumber, orderItems, userId, status } = req.body;
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
        user: userId,
        totalPrice,
        itemsCount,
        items: orderItemsCollection,
        shippingFees,
        shippingAddress: shippingAddressId,
        cardNumber,
        status: status ? status : "pending"
    });
    const payment: PaymentInterFace = new Payment({ totalAmount: totalPrice, paymentAmmount: totalPrice, paymentType: "cash", user: userId, order: newOrder._id })
    newOrder.payment = payment._id;
    await newOrder.save();
    await payment.save();
    return res.status(200).json({ status: 200, data: { order: newOrder } });

}

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { totalPrice, itemsCount, shippingFees, shippingAddressId, cardNumber, orderItems, userId } = req.body;
    let id = req.params.id;
    const orderItemsTotal = await caculateItemsPrice(orderItems);
    if (totalPrice != orderItemsTotal.totalCost) {
        return res.status(400).json({ status: 400, msg: "totalPrice not equal all items total price" });
    }
    if (shippingFees != orderItemsTotal.shippingCost) {
        return res.status(400).json({ status: 400, msg: "shippingFees not equal all items total shipping fees" });
    }
    //payment 
    const orderItemsCollection = await OrderItem.create(...orderItems);
    const newOrder: OrderInterface = await Order.findByIdAndUpdate(id, { user: userId, totalPrice, itemsCount, items: orderItemsCollection, shippingFees, shippingAddress: shippingAddressId, cardNumber }) as OrderInterface;
    // const payment: PaymentInterFace = new Payment({ totalAmount: totalPrice, paymentAmmount: totalPrice, paymentType: "cash", user: userId, order: newOrder._id })
    // newOrder.payment = payment._id;
    // await newOrder.save();
    // await payment.save();
    return res.status(200).json({ status: 200, data: { order: newOrder } });
}