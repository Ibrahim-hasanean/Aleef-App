import { NextFunction, Request, Response } from "express";
import ItemCategory from "../../../../models/ItemsCategory";

export const addItemCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const isExist = await ItemCategory.findOne({ name });
    if (isExist) res.status(400).json({ status: 400, msg: "category name is exist" });
    const category = await ItemCategory.create({ name });
    return res.status(201).json({ status: 201, data: { category } });
}

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id;
    const category = await ItemCategory.findByIdAndDelete(categoryId);
    return res.status(200).json({ status: 200, msg: "category deleted successfully" });
}

export const getItemsCategory = async (req: Request, res: Response, next: NextFunction) => {
    const categories = await ItemCategory.find({});
    return res.status(200).json({ status: 200, data: { categories } });
}
