import jwt from "jsonwebtoken";
import Staff, { StafInterface } from "../../../models/Staff";
import { Request, Response, NextFunction } from "express";
require("dotenv").config();

export default async function (req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    const token: string = authorization?.split(" ")[1] as string;
    try {
        const staffTokenSecret: string = process.env.STAF_TOKEN_SECRET as string;
        const decode: any = jwt.verify(token, staffTokenSecret);
        const staffMember: StafInterface | null = await Staff.findById(decode.staffId).populate("role");
        if (!staffMember) {
            return res.status(401).json({ status: 401, msg: "unauthorized" });
        }
        if (staffMember.role !== "storeManager" && staffMember.role !== "admin") {
            return res.status(403).json({ status: 403, msg: "not have permission" });
        }
        req.staff = staffMember;
        next()
    } catch (error) {
        return res.status(401).json({ status: 401, msg: "unauthorized" });
    }
}
