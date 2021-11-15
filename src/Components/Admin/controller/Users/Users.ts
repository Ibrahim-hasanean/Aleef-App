import { Request, Response, NextFunction } from "express";
import User, { UserInterface } from "../../../../models/User";
import mongoose from "mongoose";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    let { page, limit, text, phoneNumber } = req.query as { page: string, limit: string, text: string, phoneNumber: string };
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let query: any = {};
    if (text) query.fullName = { $regex: text, $options: "i" };
    if (phoneNumber) query.phoneNumber = phoneNumber;
    const users: UserInterface[] = await User.find(query)
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(limitNumber)
        .select(['fullName', 'phoneNumber', 'email', 'isSuspend'])
        .populate({ path: "pets", select: ['name', 'age', 'serialNumber', 'imageUrl', 'imageUrl'] });
    return res.status(200).json({ status: 200, data: { users } });
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(200).json({ status: 200, data: { user: null } });
    }
    let user: UserInterface | null = await User.findById(id)
        .select(['fullName', 'phoneNumber', 'email', 'isSuspend'])
        .populate({ path: "pets", select: ['name', 'age', 'serialNumber', 'imageUrl', 'imageUrl'] });
    return res.status(200).json({ status: 200, data: { user } });
}

export const suspendUser = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ status: 400, msg: "use not found" });
    }
    let user: UserInterface = await User.findById(id) as UserInterface;
    if (!user) return res.status(400).json({ status: 400, msg: "use not found" });
    user.isSuspend = !user.isSuspend;
    await user.save();
    return res.status(200).json({ status: 200, msg: "toggle suspended successfully" });
}


export const addNewUser = async (req: Request, res: Response, next: NextFunction) => {
    let { fullName, email, phoneNumber, password } = req.body;
    const isPhoneNumberExist: UserInterface | null = await User.findOne({ phoneNumber });
    if (isPhoneNumberExist) return res.status(409).json({ status: 409, msg: "phone number is used by other user" });
    if (email) {
        const isEmailExist: UserInterface | null = await User.findOne({ email });
        if (isEmailExist) return res.status(409).json({ status: 409, msg: "email is used by other user" });
    }
    let newUser = await User.create({ fullName, phoneNumber, password, email });
    return res.status(201).json({ status: 201, msg: "user created successfully", data: { user: newUser } });
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, phoneNumber, email } = req.body;
    let userId = req.params.id;
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ status: 400, msg: "user not found" });
    }
    const user: UserInterface | null = await User.findById(userId);
    if (!user) return res.status(400).json({ status: 400, msg: "user not found" });
    const isPhoneNumberExist: UserInterface | null = await User.findOne({ phoneNumber });
    if (isPhoneNumberExist && isPhoneNumberExist?._id.toString() !== user._id.toString()) {
        return res.status(409).json({ status: 409, msg: "phone number is used by other user" });
    }
    const isEmailExist: UserInterface | null = await User.findOne({ email });
    if (isEmailExist && isEmailExist?._id.toString() !== user._id.toString()) {
        return res.status(409).json({ status: 409, msg: "email is used by other user" });
    }
    user.fullName = fullName;
    user.email = email;
    // if (phoneNumber !== user.phoneNumber) {
    //     // const code: string = generateCode();
    //     user.code = code;
    //     user.isVerify = false;
    // }
    user.phoneNumber = phoneNumber;
    await user.save();
    res.status(200).json({
        status: 200, data: {
            user
        }
    });
}