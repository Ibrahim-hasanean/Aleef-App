import { NextFunction, Request, Response } from "express";
import Item, { ItemInterface } from "../../../models/Item";
import mongoose from "mongoose";
import isLikeITems from "../../utils/isLikeItem";

export const getItems = async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, category, text } = req.query;
    let user = req.user;
    let query: any = {};
    if (category) query.category = category;
    if (text) {
        query.$or = [{ name: { $regex: text, $options: "i" } }, { description: { $regex: text, $options: "i" } }];
    }
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    const items = await Item.find(query).skip(skip).limit(limitNumber);
    const checkItems = isLikeITems(items, user);
    return res.status(200).json({ status: 200, data: { checkItems } });
}

export const getItemById = async (req: Request, res: Response, next: NextFunction) => {
    const itemId = req.params.id;
    let user = req.user;
    if (!mongoose.isValidObjectId(itemId)) {
        return res.status(200).json({ status: 200, data: { item: null } });
    }
    let item = await Item.findById(itemId);
    if (item) {
        let isLikeItem = user.wishList.some(x => x.toString() === String(item._id));
        item = { ...item._doc, isLikeItem };
    }
    return res.status(200).json({ status: 200, data: { item } });
}


export const getWishList = async (req: Request, res: Response, next: NextFunction) => {
    const user = await req.user.populate("wishList");
    return res.status(200).json({ status: 200, data: { items: user.wishList } });
}

export const reviewItem = async (req: Request, res: Response, next: NextFunction) => {
    const itemId = req.params.id;
    const { rate } = req.body;
    if (!mongoose.isValidObjectId(itemId)) {
        return res.status(400).json({ status: 400, msg: "item not found" });
    }
    const item: ItemInterface = await Item.findById(itemId) as ItemInterface;
    if (!item) {
        return res.status(400).json({ status: 400, msg: "item not found" });
    }
    item.numberOfReviews = item.numberOfReviews + 1;
    item.sumOfReviews = item.sumOfReviews + Number(rate);
    item.review = item.sumOfReviews / item.numberOfReviews;
    await item.save();
    return res.status(200).json({ status: 200, msg: "review successfully" });
}

export const addToWishList = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const itemId = req.params.id;
        const user = req.user;
        if (!mongoose.isValidObjectId(itemId)) {
            return res.status(400).json({ status: 400, msg: "item not found" });
        }
        const item: ItemInterface = await Item.findById(itemId) as ItemInterface;
        if (!item) {
            return res.status(400).json({ status: 400, msg: "item not found" });
        }
        let usersLikedSet = new Set(item.usersLiked.map(x => String(x)));
        usersLikedSet.add(String(user._id));
        item.usersLiked = [...usersLikedSet];
        let wishListSet = new Set(user.wishList.map(x => String(x)));
        wishListSet.add(String(item._id));
        user.wishList = [...wishListSet];
        await item.save();
        await user.save();
        return res.status(200).json({ status: 200, data: { item } });

    } catch (error: any) {
        console.log(error.message);
    }
}

export const removeFromWishList = async (req: Request, res: Response, next: NextFunction) => {
    const itemId = req.params.id;
    const user = req.user;
    if (!mongoose.isValidObjectId(itemId)) {
        return res.status(400).json({ status: 400, msg: "item not found" });
    }
    const item: ItemInterface = await Item.findById(itemId) as ItemInterface;
    if (!item) {
        return res.status(400).json({ status: 400, msg: "item not found" });
    }
    item.usersLiked = item.usersLiked.filter(userId => String(userId) != String(user._id));
    let wishList: string[] = user.wishList as string[];
    user.wishList = wishList.filter((x: string) => String(x) != itemId) as string[];
    await item.save();
    await user.save();
    return res.status(200).json({ status: 200, data: { item } });
}


export const removeAllFromWishList = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    user.wishList = [];
    await user.save();
    return res.status(200).json({ status: 200, msg: "all items removed successfully from wishlist" });
}



