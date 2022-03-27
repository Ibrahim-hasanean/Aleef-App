import { NextFunction, Request, Response } from "express";
import Notification, { NotificationsInterface } from "../../../models/Notifications";
export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.query;
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let user = req.user;
    let notifications = await Notification.find({ user: user._id }).skip(skip).limit(limitNumber);
    return res.status(200).json({ status: 200, data: { notifications } });
}