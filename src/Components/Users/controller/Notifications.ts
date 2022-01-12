import { NextFunction, Request, Response } from "express";
import Notification from "../../../models/Notifications";
export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.query;
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let notifications = await Notification.find({}).skip(skip).limit(limitNumber);
    return res.status(201).json({ status: 201, data: { notifications } });
}