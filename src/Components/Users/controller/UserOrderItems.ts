import { NextFunction, Request, Response } from "express";
import User, { UserInterface } from "../../../models/User";
import OrderItems, { OrdersItemsInterface } from "../../../models/OrderItems";
import Item from "../../../models/Item";
import mongoose, { ObjectId } from "mongoose";

export const addOrderItems = async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user;
    let { itemId, count } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(200).json({ status: 200, msg: `item with id ${itemId} not found` });
    const orderItem: OrdersItemsInterface = await OrderItems.create({ item: itemId, count });
    user.itemList = [...user.itemList, orderItem._id];
    await user.save();
    return res.status(201).json({ status: 201, data: { items: orderItem } });
}

export const getOrderItems = async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user
    // .populate({ path: "itemList", populate: "item" });
    let userWithWishList = await User.findById(user._id).populate({ path: "itemList", populate: "item" }) as UserInterface;
    return res.status(200).json({ status: 200, data: { items: userWithWishList.itemList } });
}

export const clearOrderItems = async (req: Request, res: Response, next: NextFunction) => {
    let user = await req.user.populate("itemList");
    user.itemList = [];
    await user.save();
    return res.status(200).json({ status: 200, msg: "all item list removed successfully" });
}

export const updateOrderList = async (req: Request, res: Response, next: NextFunction) => {
    let { count } = req.body;
    let id = req.params.id;
    const orderItem: OrdersItemsInterface = await OrderItems.findById(id) as OrdersItemsInterface;
    if (!orderItem) return res.status(400).json({ status: 400, msg: `item list with id ${id} not found` });
    orderItem.count = count;
    await orderItem.save();
    let populatedOrderItem = await orderItem.populate("item");
    return res.status(200).json({ status: 200, data: { item: populatedOrderItem } });
}

export const removeItemFromOrderList = async (req: Request, res: Response, next: NextFunction) => {
    let orderItemId = req.params.id;
    const user = req.user;
    const orderItem: OrdersItemsInterface = await OrderItems.findById(orderItemId) as OrdersItemsInterface;
    if (!mongoose.isValidObjectId(orderItemId)) {
        return res.status(400).json({ status: 400, msg: `${orderItemId} invalid id` });
    }
    if (!orderItem) return res.status(400).json({ status: 400, msg: `item list with id ${orderItemId} not found` });
    let itemsList: ObjectId[] = user.itemList as ObjectId[];
    itemsList = itemsList.filter(x => String(x) != String(orderItem._id));
    user.itemList = itemsList;
    await user.save();
    await orderItem.delete();
    return res.status(201).json({ status: 200, msg: "order item removed successfully" });
}


