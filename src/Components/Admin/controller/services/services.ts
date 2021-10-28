import { NextFunction, Request, Response } from "express";
import Service from "../../../../models/Services";

export const addService = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    let isExist = await Service.findOne({ name });
    if (isExist) return res.status(409).json({ status: 409, msg: "service name exist" });
    let newService = await Service.create({ name });
    return res.status(201).json({ status: 201, data: { service: newService } });
}

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
    let services = await Service.find({});
    return res.status(200).json({ status: 200, data: { services } });
}

export const getServiceById = async (req: Request, res: Response, next: NextFunction) => {
    let serviceId = req.params.id;
    let service = await Service.findById(serviceId);
    return res.status(200).json({ status: 200, data: { service } });
}

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
    let serviceId = req.params.id;
    let service = await Service.findByIdAndDelete(serviceId);
    return res.status(200).json({ status: 200, msg: "service deleted successfully" });
}