import { Request, Response, NextFunction } from "express";
import User, { UserInterface } from "../../../models/User";
import jwt from "jsonwebtoken";
require("dotenv").config();
export default async function verifyUser(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    const token: string = authorization?.split(" ")[1] as string;
    try {
        const userTokenSecret: string = process.env.USER_TOKEN_SECRET as string;
        const decode: any = jwt.verify(token, userTokenSecret);
        const user: UserInterface | null = await User.findById(decode.userId);
        if (!user) {
            return res.status(401).json({ status: 401, msg: "unauthorized" });
        }
        req.user = user;
        next()
    } catch (error) {
        return res.status(401).json({ status: 401, msg: "unauthorized" });
    }



}