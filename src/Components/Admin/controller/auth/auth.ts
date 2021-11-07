import Staff, { StafInterface } from "../../../../models/Staff";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber, password } = req.body;
    const staffMember: StafInterface = await Staff.findOne({ phoneNumber }) as StafInterface;
    if (!staffMember) return res.status(400).json({ status: 400, msg: "user not found" });
    const comparePassword = await staffMember.comaprePassword(password);
    if (!comparePassword) return res.status(400).json({ status: 400, msg: "wrong password" });
    const staffMembersToken: string = process.env.STAF_TOKEN_SECRET as string;
    let token = jwt.sign({ staffId: staffMember._id, phoneNumber: staffMember.phoneNumber },
        staffMembersToken,
        { expiresIn: "7 days" }
    );
    return res.status(200).json({ status: 200, data: { staffMember: staffMember, token } });
}


