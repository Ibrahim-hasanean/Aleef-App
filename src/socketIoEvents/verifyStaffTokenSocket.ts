import Staff, { StafInterface } from "../models/Staff";
import jwt from "jsonwebtoken";
require("dotenv").config();
const verifyStaff = async (token: string) => {
    try {
        const staffTokenSecret: string = process.env.STAF_TOKEN_SECRET as string;
        const decode: any = jwt.verify(token, staffTokenSecret);
        const staffMember: StafInterface | null = await Staff.findById(decode.staffId);
        if (!staffMember) {
            throw new Error("staff Member not found");
        }
        return staffMember;
    } catch (error: any) {
        console.log(error.message)
        throw new Error("not authorize")
    }
}
export default verifyStaff;