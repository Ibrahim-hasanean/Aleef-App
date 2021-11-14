import { NextFunction, Request, Response } from "express";
import Item from "../../../../models/Item";

export const addItem = async (req: Request, res: Response, next: NextFunction) => {
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
    let newItem = await Item.create({
        name,
        description,
        price,
        category,
        serialNumber,
        avaliableQuantity,
        allowed,
        shippingPrice,
        additionDate
    });
    return res.status(201).json({ status: 201, data: { item: newItem } });
}

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
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
    let newItem = await Item.findByIdAndUpdate(itemId, {
        name,
        description,
        price,
        category,
        serialNumber,
        avaliableQuantity,
        allowed,
        shippingPrice,
        additionDate
    });
    return res.status(200).json({ status: 200, data: { item: newItem } });
}

export const getItems = async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit, category, text } = req.query;
    let query: any = {};
    if (category) query.category = category;
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
    let item = await Item.findById(itemId);
    return res.status(200).json({ status: 200, data: { item } });
}

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
    const itemId = req.params.id;
    let item = await Item.findByIdAndDelete(itemId);
    return res.status(200).json({ status: 200, data: { item } });

}

