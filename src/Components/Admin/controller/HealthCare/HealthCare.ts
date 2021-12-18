import HealthCare, { HealthCareInterface } from "../../../../models/HealthCare";
import { NextFunction, Request, Response } from "express";


export const addHealthCareTip = async (req: Request, res: Response, next: NextFunction) => {
    let { description } = req.body;
    const isHealthCareExist = await HealthCare.find({});
    if (isHealthCareExist.length > 0) {
        let healthCareTips = isHealthCareExist[0];
        healthCareTips.description = description;
        await healthCareTips.save();
        return res.status(200).json({ status: 200, msg: "new health care  tips are added" });
    }
    let newHealthCare = await HealthCare.create({ description });
    return res.status(200).json({ status: 200, msg: "new health care tips are added" });
}

export const getHealthCare = async (req: Request, res: Response, next: NextFunction) => {
    let healthCares = await HealthCare.find({});
    return res.status(201).json({ status: 201, data: { healthCare: healthCares[0] || "" } });
}
