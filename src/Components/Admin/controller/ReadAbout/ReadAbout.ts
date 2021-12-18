import ReadAbout, { ReadAboutInterface } from "../../../../models/ReadAboute";
import { NextFunction, Request, Response } from "express";


export const addReadAbout = async (req: Request, res: Response, next: NextFunction) => {
    let { description } = req.body;
    const isReadAboutxist = await ReadAbout.find({});
    if (isReadAboutxist.length > 0) {
        let readAbout = isReadAboutxist[0];
        readAbout.description = description;
        await readAbout.save();
        return res.status(200).json({ status: 200, msg: "new read about are added" });
    }
    let newReadAbout = await ReadAbout.create({ description });
    return res.status(200).json({ status: 200, msg: "new read about are added" });
}

export const getReadAboute = async (req: Request, res: Response, next: NextFunction) => {
    let readAbout = await ReadAbout.find({});
    return res.status(201).json({ status: 201, data: { healthCare: readAbout[0] || "" } });
}
