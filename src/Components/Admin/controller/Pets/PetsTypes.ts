import { NextFunction, Request, Response } from "express";
import PetsTypes from "../../../../models/PetsTypes";

export const addPetsType = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const type = await PetsTypes.create({ name });
    return res.status(201).json({ status: 201, data: { type } });
}

export const deleteType = async (req: Request, res: Response, next: NextFunction) => {
    const typeId = req.params.id;
    const type = await PetsTypes.findByIdAndDelete(typeId);
    return res.status(200).json({ status: 200, msg: "pets type deleted successfully" });
}

export const getTypes = async (req: Request, res: Response, next: NextFunction) => {
    const types = await PetsTypes.find({}).populate("breeds")
    return res.status(200).json({ status: 200, data: { types } });
}
