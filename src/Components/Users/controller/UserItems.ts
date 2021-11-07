import { NextFunction, Request, Response } from "express";
import Item, { ItemInterface } from "../../../models/Item";

export const getItems = async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, categoryId, text } = req.query;
    let query: any = {};
    if (categoryId) query.category = categoryId;
    if (text) {
        query.$or = [{ name: { $regex: text, $options: "i" } }, { description: { $regex: text, $options: "i" } }];
    }
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    const items = await Item.find(query).skip(skip).limit(limitNumber);
    return res.status(200).json({ status: 200, data: { items } });
}

export const getItemById = async (req: Request, res: Response, next: NextFunction) => {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    return res.status(200).json({ status: 200, data: { item } });
}


export const getWishList = async (req: Request, res: Response, next: NextFunction) => {
    const user = await req.user.populate("wishList");
    return res.status(200).json({ status: 200, data: { items: user.wishList } });
}

export const addToWishList = async (req: Request, res: Response, next: NextFunction) => {
    const itemId = req.params.id;
    const user = req.user;
    const items: ItemInterface = await Item.findById(itemId);
    let usersLikedSet = new Set(items.usersLiked.map(x => String(x)));
    usersLikedSet.add(String(user._id));
    items.usersLiked = [...usersLikedSet];
    let wishListSet = new Set(user.wishList.map(x => String(x)));
    wishListSet.add(String(items._id));
    user.wishList = [...wishListSet];
    await items.save();
    await user.save();
    return res.status(200).json({ status: 200, data: { items } });
}

export const removeFromWishList = async (req: Request, res: Response, next: NextFunction) => {
    const itemId = req.params.id;
    const user = req.user;
    const items: ItemInterface = await Item.findById(itemId);
    items.usersLiked = items.usersLiked.filter(userId => String(userId) != String(user._id));
    let wishList: string[] = user.wishList as string[];
    user.wishList = wishList.filter((x: string) => String(x) != itemId) as string[];
    await items.save();
    await user.save();
    return res.status(200).json({ status: 200, data: { items } });
}



