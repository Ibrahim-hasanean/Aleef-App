import ReadAbout from "../../../models/ReadAboute";
import { NextFunction, Request, Response } from "express";

export const getReadAboute = async (req: Request, res: Response, next: NextFunction) => {
    let readAbout = await ReadAbout.find({});
    return res.status(201).json({ status: 201, data: { healthCare: readAbout[0] || "" } });
}
