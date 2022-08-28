import { Request, Response, NextFunction } from "express";
import Staff, { StafInterface } from "../../../../models/Staff";
import HealthCare, { HealthCareInterface } from "../../../../models/HealthCare";
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
    try {
        const { phoneNumber, code, registrationToken } = req.body;
        const staffMember: StafInterface = await Staff.findOne({ phoneNumber }) as StafInterface;
        if (!staffMember) return res.status(400).json({ status: 400, msg: `staff member with phonenumber ${phoneNumber} not exist` });
        let isCodeEqual = staffMember.code === code;
        let healthCares = await HealthCare.find({});
        if (isCodeEqual) {
            const staffMembersToken: string = process.env.STAF_TOKEN_SECRET as string;
            let token = jwt.sign({ staffId: staffMember._id, phoneNumber: staffMember.phoneNumber },
                staffMembersToken,
                { expiresIn: "7 days" }
            );
            staffMember.code = '';
            if (registrationToken) staffMember.registrationTokens.push(registrationToken);
            await staffMember.save();
            return res.status(200).json({ status: 200, data: { staffMember: staffMember, healthCare: healthCares[0], token } });
        }
        return res.status(400).json({ status: 400, msg: "code is wrong" });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ status: 500, msg: error.message })
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    const { registrationToken } = req.body;
    let staffMember = req.staff;
    staffMember.registrationTokens = staffMember.registrationTokens.filter(x => x !== registrationToken);
    await staffMember.save();
    return res.status(200).json({ status: 200, msg: "logout successfully" });
}


