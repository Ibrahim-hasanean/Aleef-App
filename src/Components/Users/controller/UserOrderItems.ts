import { NextFunction, Request, Response } from "express";
import User, { UserInterface } from "../../../models/User";
import OrderItems, { OrdersItemsInterface } from "../../../models/OrderItems";
import Item from "../../../models/Item";


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
    let { itemId, count } = req.body;
    let id = req.params.id;
    let user = req.user;
    const item = await Item.findById(itemId);
    if (!item) return res.status(200).json({ status: 200, msg: `item with id ${itemId} not found` });
    const orderItem: OrdersItemsInterface = await OrderItems.findById(id);
    orderItem.count = count;
    orderItem.item = itemId;
    await orderItem.save();
    let populatedOrderItem = await orderItem.populate("item");

    return res.status(201).json({ status: 201, data: { item: populatedOrderItem } });

}


