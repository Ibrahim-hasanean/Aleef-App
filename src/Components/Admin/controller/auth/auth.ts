import Staff, { StafInterface } from "../../../../models/Staff";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import generateCode from "../../../utils/GenerateCode";
dotenv.config();

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber } = req.body;
    const staffMember: StafInterface = await Staff.findOne({ phoneNumber }) as StafInterface;
    if (!staffMember) return res.status(400).json({ status: 400, msg: "user not found" });
    let code = generateCode();
    staffMember.code = code;
    await staffMember.save();
    //send code
    return res.status(200).json({ status: 200, msg: "code sent to user phone number" });
}
export const verifyCode = async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber, code } = req.body;
    const staffMember: StafInterface = await Staff.findOne({ phoneNumber }) as StafInterface;
    let isCodeEqual = staffMember.code === code;
    if (isCodeEqual) {
        const staffMembersToken: string = process.env.STAF_TOKEN_SECRET as string;
        let token = jwt.sign({ staffId: staffMember._id, phoneNumber: staffMember.phoneNumber },
            staffMembersToken,
            { expiresIn: "7 days" }
        );
        staffMember.code = '';
        await staffMember.save();
        return res.status(200).json({ status: 200, data: { staffMember: staffMember, token } });
    }
    return res.status(400).json({ status: 400, msg: "code is wrong" });
}


