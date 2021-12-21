import Location, { LocationInterface } from "../../../../models/Location";
import { NextFunction, Request, Response } from "express";


export const addLocation = async (req: Request, res: Response, next: NextFunction) => {
    let { lat, long } = req.body;
    const isLocationExist = await Location.find({});
    if (isLocationExist.length > 0) {
        let location: LocationInterface = isLocationExist[0];
        location.lat = lat;
        location.long = long;
        await location.save();
        return res.status(200).json({ status: 200, msg: "new location are added" });
    }
    let location = await Location.create({ lat, long });
    return res.status(200).json({ status: 200, msg: "new location are added" });
}

export const getLocation = async (req: Request, res: Response, next: NextFunction) => {
    let location = await Location.find({});
    return res.status(200).json({ status: 200, data: { healthCare: location[0] || "" } });
}
