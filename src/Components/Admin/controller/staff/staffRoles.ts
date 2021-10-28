import { NextFunction, Request, Response } from "express";
import StaffRoles from "../../../../models/StaffRoles";

export const addStaffRole = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const isRoleExist = await StaffRoles.findOne({ name });
    if (isRoleExist) return res.status(409).json({ status: 409, msg: "this role has been added" });
    const newStaffRole = await StaffRoles.create({ name });
    return res.status(201).json({
        status: 201, msg: "staff role added successfully", data: {
            staffRole: newStaffRole
        }
    });
}

export const getStaffRole = async (req: Request, res: Response, next: NextFunction) => {
    const staffRoles = await StaffRoles.find({});
    return res.status(200).json({
        status: 200, msg: "staff role added successfully", data: {
            staffRoles
        }
    });
}

export const deleteStaffRole = async (req: Request, res: Response, next: NextFunction) => {
    const staffRoleId = req.params.id;
    const isRoleExist = await StaffRoles.findByIdAndDelete(staffRoleId);
    return res.status(200).json({
        status: 200, msg: "staff role deleted successfully"
    });
}