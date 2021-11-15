import User, { UserInterface } from "../../../models/User";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import generateCode from "../../utils/GenerateCode";
require("dotenv").config();

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, phoneNumber, password } = req.body;
    const isExist: UserInterface | null = await User.findOne({ phoneNumber });
    if (isExist) return res.status(409).json({ status: 409, msg: "phone number is used" });
    const code = generateCode();
    let newUser = await User.create({ fullName, phoneNumber, password, code });
    //send sms to user
    return res.status(201).json({ status: 201, msg: "user register successfully" });
}

export const socialLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, phoneNumber, email } = req.body;
    const isExist: UserInterface | null = await User.findOne({ phoneNumber });
    if (isExist) return res.status(409).json({ status: 409, msg: "phone number is used" });
    let newUser = await User.create({ fullName, phoneNumber, email });
    //send sms to user
    return res.status(201).json({ status: 201, data: { user: newUser } });
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber, password } = req.body;
    const user: UserInterface | null = await User.findOne({ phoneNumber });
    if (!user) return res.status(400).json({ status: 400, msg: "user not signed up" });
    if (!user.isVerify) return res.status(403).json({ status: 403, msg: "user account not verified" });
    let comparePassword: boolean = await user.comaprePassword(password);
    if (!comparePassword) return res.status(400).json({ status: 400, msg: "wrong password" });
    let tokenSecret = process.env.USER_TOKEN_SECRET as string;
    let token = jwt.sign(
        { userId: user._id, phoneNumber: user.phoneNumber, email: user.email },
        tokenSecret,
        { expiresIn: "7 days" }
    );
    return res.status(200).json({
        status: 200, data: {
            user, token
        }
    })
}

export const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber } = req.body;
    const user: UserInterface | null = await User.findOne({ phoneNumber });
    if (!user) return res.status(400).json({ status: 400, msg: "user not signed up" });
    const code: string = generateCode();
    //send code
    user.code = code;
    await user.save();
    return res.status(200).json({ status: 200, msg: "code is send to your phone number" });
}


export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber, code, newPassword } = req.body;
    const user: UserInterface | null = await User.findOne({ phoneNumber });
    if (!user) return res.status(400).json({ status: 400, msg: "user not signed up" });
    if (!user.code) {
        return res.status(400).json({ status: 400, msg: "try to resend the code" });
    }
    if (code == user.code) {
        user.password = newPassword;
        user.code = "";
        await user.save();
        return res.status(200).json({ status: 200, msg: "reset password success" });
    }
    return res.status(400).json({ status: 400, msg: "code you entered is wrong" });
}

export const verifyCode = async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber, code } = req.body;
    const user: UserInterface | null = await User.findOne({ phoneNumber });
    if (!user) return res.status(400).json({ status: 400, msg: "user not signed up" });
    if (!user.code) {
        return res.status(400).json({ status: 400, msg: "try to resend the code" });
    }
    if (code == user.code) {
        user.isVerify = true;
        user.code = "";
        await user.save();
        return res.status(200).json({ status: 200, msg: "code verified" });
    }
    return res.status(400).json({ status: 400, msg: "code you entered is wrong" });
}