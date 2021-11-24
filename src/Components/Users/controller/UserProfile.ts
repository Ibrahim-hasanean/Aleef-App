import User, { UserInterface } from "../../../models/User";
import { Request, Response, NextFunction } from "express";
import generateCode from "../../utils/GenerateCode";
import Address, { AddressInterface } from "../../../models/Address";
import { ObjectId } from "mongoose";

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, phoneNumber, email } = req.body;
    const user: UserInterface = req.user;
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
    if (phoneNumber !== user.phoneNumber) {
        const code: string = generateCode();
        user.code = code;
        user.isVerify = false;
    }
    user.phoneNumber = phoneNumber;
    await user.save();
    res.status(200).json({
        status: 200, data: {
            user
        }
    });
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    const comparePassword: boolean = await user.comaprePassword(currentPassword);
    if (!comparePassword) {
        return res.status(400).json({ status: 400, msg: "current password is wrong" });
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ status: 200, msg: "password updated successfully" });
}

export const notificationSettings = async (req: Request, res: Response, next: NextFunction) => {
    const { muteAllNotification, muteChat, vaccinationReminder, appointmentReminder, medacinReminder } = req.body;
    const user = req.user;
    if (typeof muteAllNotification == 'boolean') user.muteAllNotification = muteAllNotification;
    if (typeof muteChat == 'boolean') user.muteChat = muteChat;
    if (typeof vaccinationReminder == 'boolean') user.vaccinationReminder = vaccinationReminder;
    if (typeof appointmentReminder == 'boolean') user.appointmentReminder = appointmentReminder;
    if (typeof medacinReminder == 'boolean') user.medacinReminder = medacinReminder;
    await user.save();
    return res.status(200).json({ status: 200, msg: "notification settings updated  successfully" });
}

export const addAddress = async (req: Request, res: Response, next: NextFunction) => {
    const { city, street, detailes } = req.body as { city: string, street: string, detailes: string };
    const user = req.user;
    const address = await Address.create({
        city, street, detailes
    });
    user.addresses.push(address._id);
    await user.save();
    return res.status(201).json({ status: 201, msg: "address added successfully" });
}

export const getAddresses = async (req: Request, res: Response, next: NextFunction) => {
    const user = await req.user.populate("addresses");
    return res.status(200).json({
        status: 200, data: {
            addresses: user.addresses
        }
    });
}

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    const user = await req.user.populate("addresses")
    let addressId = req.params.id;
    await Address.findByIdAndDelete(addressId);
    let addresses: ObjectId[] = user.addresses as ObjectId[];
    user.addresses = addresses.filter((x: ObjectId) => String(x) !== addressId);
    // user.addresses = [...addresses];
    await user.save();
    return res.status(200).json({
        status: 200, data: {
            addresses: user.addresses
        }
    });
}

// export const setLanguage = async (req: Request, res: Response, next: NextFunction) => {
//     let user = req.user;
//     req.headers.
//     let {} = req.body;


// }