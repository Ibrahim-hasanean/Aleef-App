import Location from "../../../models/Location";
import { NextFunction, Request, Response } from "express";


export const getLocation = async (req: Request, res: Response, next: NextFunction) => {
    let location = await Location.find({});
    return res.status(200).json({ status: 200, data: { healthCare: location[0] || "" } });
}
