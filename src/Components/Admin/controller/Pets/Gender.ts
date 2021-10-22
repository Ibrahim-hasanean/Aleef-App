import { NextFunction, Request, Response } from "express";
import Gender from "../../../../models/Gender";

export const addGender = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const gender = await Gender.create({ name });
    return res.status(201).json({ status: 201, data: { gender } });
}

export const deleteGender = async (req: Request, res: Response, next: NextFunction) => {
    const typeId = req.params.id;
    const type = await Gender.findByIdAndDelete(typeId);
    return res.status(200).json({ status: 200, msg: "gender deleted successfully" });
}

export const getGender = async (req: Request, res: Response, next: NextFunction) => {
    const genders = await Gender.find({});
    return res.status(200).json({ status: 200, data: { genders } });
}
