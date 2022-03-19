import { NextFunction, Request, Response } from "express";
import Item, { ItemInterface } from "../../../../models/Item";
import ItemsCategory from "../../../../models/ItemsCategory";
import Order from "../../../../models/Order";
import User from "../../../../models/User";
import uploadImageToStorage from "../../../utils/uploadFileToFirebase";

export const addItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let {
            name,
            description,
            price,
            category,
            serialNumber,
            avaliableQuantity,
            allowed,
            shippingPrice,
            additionDate
        } = req.body;
        let files: any = req.files;
        let mainImage = files?.mainImage;
        let images = files?.images;
        images = images ? images : [];
        let mainImageUrl = mainImage && mainImage[0] ? await uploadImageToStorage(mainImage[0]) : "";
        let uploadImagesFunctions = images.map(async (image: any) => await uploadImageToStorage(image));
        let imagesUrls = await Promise.all(uploadImagesFunctions);
        let newItem = await Item.create({
            name,
            description,
            price,
            category,
            serialNumber,
            avaliableQuantity,
            allowed,
            shippingPrice,
            additionDate, mainImageUrl, images: imagesUrls
        });

        return res.status(201).json({ status: 201, data: { item: newItem } });
    } catch (error: any) {
        return res.status(500).json({ status: 500, msg: error.message });
    }
}

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
    try {

        let itemId = req.params.id;
        let {
            name,
            description,
            price,
            category,
            serialNumber,
            avaliableQuantity,
            allowed,
            shippingPrice,
            additionDate
        } = req.body;
        let body: any = {
            name,
            description,
            price,
            category,
            serialNumber,
            avaliableQuantity,
            allowed,
            shippingPrice,
            additionDate
        }
        let files: any = req.files;
        let mainImage = files?.mainImage;
        let images = files?.images;
        images = images ? images : [];
        let mainImageUrl = mainImage && mainImage[0] ? await uploadImageToStorage(mainImage[0]) : null;
        let uploadImagesFunctions = images.map(async (image: any) => await uploadImageToStorage(image));
        let imagesUrls = await Promise.all(uploadImagesFunctions);
        if (mainImageUrl) body.mainImageUrl = mainImageUrl;
        if (imagesUrls.length > 0) body.images = imagesUrls;
        let newItem = await Item.findByIdAndUpdate(itemId, body, { new: true });
        return res.status(200).json({ status: 200, data: { item: newItem } });
    } catch (error: any) {
        return res.status(500).json({ status: 500, msg: error.message });

    }
}

export const getItems = async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, category, text, sortBy } = req.query;
    let query: any = { allowed: true };
    let sort: any = { createdAt: "desc" };
    if (category) query.category = category;
    if (text) {
        query.$or = [{ name: { $regex: text, $options: "i" } }, { description: { $regex: text, $options: "i" } }];
    }
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    if (sortBy) {
        if (sortBy == "soldQuantity") sort = { soldQuantity: "desc" }
        else if (sortBy == "almostOutOfStock") sort = { avaliableQuantity: "asc" }
    }
    const items = await Item.find(query).skip(skip).limit(limitNumber).sort(sort);
    const itemsCount = await Item.find(query).count();
    return res.status(200).json({ status: 200, data: { items, page: page || 1, limit: limit || 10, itemsCount } });
}

export const itemsHome = async (req: Request, res: Response, next: NextFunction) => {
    let { from, to } = req.query as { from: string, to: string };
    let fromDate = new Date(from);
    let toDate = new Date(to);
    let query: any = {};
    if (from || to) {
        query.createdAt = {};
        if (from) query.createdAt = { ...query.createdAt, $gte: fromDate }
        if (to) query.createdAt = { ...query.createdAt, $lte: toDate }
    }
    let totalRevenue = await Order
        .aggregate([
            { $match: query },
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
        ]);
    let totalOrders = await Order.find(query).count();
    let totalClients = await User.find(query).count();
    let newOrders = await Order
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
        .limit(10)
        .exec();
    let mostOrdered = await Item.find().sort({ soldQuantity: "desc" }).limit(10);
    let itemsAlmostOutOfStock = await Item.find().sort({ avaliableQuantity: "asc" }).limit(10);
    return res.status(200).json({
        status: 200, data: {
            totalRevenue: totalRevenue[0]?.totalRevenue,
            totalClients,
            totalOrders,
            newOrders,
            mostOrdered,
            itemsAlmostOutOfStock
        }
    });

}

export const getItemById = async (req: Request, res: Response, next: NextFunction) => {
    const itemId = req.params.id;
    let item = await Item.findById(itemId);
    return res.status(200).json({ status: 200, data: { item } });
}

export const toggleHide = async (req: Request, res: Response, next: NextFunction) => {
    const itemId = req.params.id;
    let item: ItemInterface = await Item.findById(itemId) as ItemInterface;
    if (!item) return res.status(400).json({ status: 400, msg: "item not found" });
    item.allowed = !item.allowed;
    await item.save();
    return res.status(200).json({ status: 200, data: { item }, msg: "item isHide toggeled successfully" });
}

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
    const itemId = req.params.id;
    let item = await Item.findByIdAndDelete(itemId);
    return res.status(200).json({ status: 200, data: { item } });

}

