import { NextFunction, Request, Response } from "express";
import Notification from "../../../../models/Notifications";

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.query;
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let staffMemeber = req.staff;
    let notifications = await Notification.find({ staffMemeber: staffMemeber._id }).skip(skip).limit(limitNumber);
    let notificationsCount = await Notification.find({ staffMemeber: staffMemeber._id }).count();
    return res.status(200).json({ status: 200, data: { notifications, page: page || 1, limit: limit || 10, notificationsCount } });
}
