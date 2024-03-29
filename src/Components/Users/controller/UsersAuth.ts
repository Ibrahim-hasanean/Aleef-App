import User, { UserInterface } from "../../../models/User";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import generateCode from "../../utils/GenerateCode";
import uploadImageToStorage from "../../utils/uploadFileToFirebase";
import facebookAccessTokenAuth from "../../utils/FacebookAccessTokenAuth";
import GoogleAccessTokenAuth from "../../utils/GoogleAccessTokenAuth";
require("dotenv").config();

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, phoneNumber, password, registrationToken } = req.body;
    const isExist: UserInterface | null = await User.findOne({ phoneNumber });
    if (isExist) return res.status(409).json({ status: 409, msg: "phone number is used" });
    const code = generateCode();
    let newUser = await User.create({ fullName, phoneNumber, password, code, registrationTokens: [registrationToken] });
    let tokenSecret = process.env.USER_TOKEN_SECRET as string;
    let token = jwt.sign(
        { userId: newUser._id, phoneNumber: newUser.phoneNumber, email: newUser.email },
        tokenSecret,
        { expiresIn: "7 days" }
    );
    //send sms to user
    return res.status(201).json({ status: 201, msg: "user register successfully", token });
}

export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, registrationToken } = req.body;
    try {
        const googaData = await GoogleAccessTokenAuth(accessToken);
        const isExist: UserInterface | null = await User.findOne({ email: googaData.email });
        if (isExist) {
            let tokenSecret = process.env.USER_TOKEN_SECRET as string;
            let token = jwt.sign(
                { userId: isExist._id, email: isExist.email },
                tokenSecret,
                { expiresIn: "7 days" }
            );
            isExist.registrationTokens = [...isExist.registrationTokens, registrationToken];
            await isExist.save();
            return res.status(200).json({ status: 200, msg: "login success", data: { token, user: isExist } });
        }
        let newUser = await User.create({ fullName: googaData.name, email: googaData.email, imageUrl: googaData.picture, registrationTokens: [registrationToken] });
        let tokenSecret = process.env.USER_TOKEN_SECRET as string;
        let token = jwt.sign(
            { userId: newUser._id, phoneNumber: newUser.phoneNumber, email: newUser.email },
            tokenSecret,
            { expiresIn: "7 days" }
        );
        return res.status(201).json({ status: 201, msg: "user registered successfully", data: { token, user: newUser } });

    } catch (error: any) {
        console.log(error.message)
        return res.status(400).json({ status: 400, msg: error });
    }
}

export const facebookAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, registrationToken } = req.body;
    try {
        const facebookData = await facebookAccessTokenAuth(accessToken);
        const isExist: UserInterface | null = await User.findOne({ email: facebookData.email });
        if (isExist) {
            let tokenSecret = process.env.USER_TOKEN_SECRET as string;
            let token = jwt.sign(
                { userId: isExist._id, email: isExist.email },
                tokenSecret,
                { expiresIn: "7 days" }
            );
            isExist.registrationTokens = [...isExist.registrationTokens, registrationToken];
            await isExist.save();
            return res.status(200).json({ status: 200, msg: "login success", data: { token, user: isExist } });
        }
        let newUser = await User.create({ fullName: facebookData.name, email: facebookData.email, imageUrl: facebookData.picture?.data?.url, registrationTokens: [registrationToken] });
        let tokenSecret = process.env.USER_TOKEN_SECRET as string;
        let token = jwt.sign(
            { userId: newUser._id, phoneNumber: newUser.phoneNumber, email: newUser.email },
            tokenSecret,
            { expiresIn: "7 days" }
        );
        return res.status(201).json({ status: 201, msg: "user registered successfully", data: { token, user: newUser } });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: 400, msg: error });
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber, password, registrationToken } = req.body;
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
    user.registrationTokens = [...user.registrationTokens, registrationToken];
    await user.save()
    return res.status(200).json({
        status: 200, data: {
            user, token
        }
    })
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    const { registrationToken } = req.body;
    let user = req.user;
    user.registrationTokens = user.registrationTokens.filter(x => x != registrationToken);
    await user.save();
    return res.status(200).json({
        status: 200, msg: "user log out"
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
    // if (!user.code) {
    //     return res.status(400).json({ status: 400, msg: "try to resend the code" });
    // }
    // if (code == user.code) {
    user.password = newPassword;
    user.code = "";
    await user.save();
    return res.status(200).json({ status: 200, msg: "reset password success" });
    // }
    // return res.status(400).json({ status: 400, msg: "code you entered is wrong" });
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