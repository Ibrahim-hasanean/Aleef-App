import HealthCare, { HealthCareInterface } from "../../../models/HealthCare";
import { NextFunction, Request, Response } from "express";

export const getHealthCare = async (req: Request, res: Response, next: NextFunction) => {
    let healthCares = await HealthCare.find({});
    return res.status(201).json({ status: 201, data: { healthCare: healthCares[0] || "" } });
}