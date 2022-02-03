import User, { UserInterface } from "../models/User";
import jwt from "jsonwebtoken";
require("dotenv").config();
const verifyUser = async (token: string) => {
    try {
        const userTokenSecret: string = process.env.USER_TOKEN_SECRET as string;
        const decode: any = jwt.verify(token, userTokenSecret);
        const user: UserInterface | null = await User.findById(decode.userId);
        if (!user) {
            throw new Error("user not found");
        }
        return user;
    } catch (error: any) {
        console.log(error.message)
        throw new Error("not authorize")
    }
}
export default verifyUser;