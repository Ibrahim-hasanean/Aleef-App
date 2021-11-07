import { NextFunction, Request, Response } from "express";
import Staff, { StafInterface } from "../../../../models/Staff";

export const addStaff = async (req: Request, res: Response, next: NextFunction) => {
    const { name, cardNumber, phoneNumber, email, role, staffMemberId, password } = req.body;
    const isPhoneNumberExist = await Staff.findOne({ phoneNumber });
    if (isPhoneNumberExist) return res.status(409).json({ status: 409, msg: "phone number is used before" });
    const isCardNumberExist = await Staff.findOne({ cardNumber });
    if (isCardNumberExist) return res.status(409).json({ status: 409, msg: "card number is used before" });
    const newStaff = await Staff.create({ name, password, cardNumber, phoneNumber, email, role, staffMemberId });
    return res.status(201).json({
        status: 201, msg: "staff member added successfully", data: {
            staffMember: newStaff
        }
    });
}

export const updateStaff = async (req: Request, res: Response, next: NextFunction) => {
    const memberId = req.params.id;
    const { name, cardNumber, phoneNumber, email, role, staffMemberId, password } = req.body;
    let staffMember = await Staff.findById(memberId) as StafInterface;
    const isPhoneNumberExist = await Staff.findOne({ phoneNumber });
    if (isPhoneNumberExist && String(staffMember._id) !== String(isPhoneNumberExist._id))
        return res.status(409).json({ status: 409, msg: "phone number is used before" });
    const isCardNumberExist = await Staff.findOne({ cardNumber });
    if (isCardNumberExist && String(staffMember._id) !== String(isCardNumberExist._id))
        return res.status(409).json({ status: 409, msg: "card number is used before" });
    const newStaff: StafInterface = await Staff.findById(memberId) as StafInterface;
    newStaff.name = name;
    newStaff.password = password;
    newStaff.cardNumber = cardNumber;
    newStaff.phoneNumber = phoneNumber;
    newStaff.email = email;
    newStaff.staffMemberId = staffMemberId;
    newStaff.role = role;
    await newStaff.save();
    console.log("update staff member")
    return res.status(200).json({
        status: 200, msg: "staff member updated successfully", data: {
            staffMember: newStaff
        }
    });
}

export const getStaffMemebers = async (req: Request, res: Response, next: NextFunction) => {
    const staffMembers = await Staff.find({});
    return res.status(200).json({ status: 200, data: { staffMembers } });
}

export const getStaffMemeberById = async (req: Request, res: Response, next: NextFunction) => {
    const staffId = req.params.id;
    const staffMember = await Staff.findById(staffId);
    return res.status(200).json({ status: 200, data: { staffMember } });
}

export const deleteStaffMember = async (req: Request, res: Response, next: NextFunction) => {
    const staffId = req.params.id;
    const staffMember = await Staff.findByIdAndDelete(staffId);
    return res.status(200).json({ status: 200, msg: "staff member deleted sucessfully" });
}


export const defaultAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const newStaff = await Staff.create({ name: "ibrahim", password: "123456789", cardNumber: 123456789, phoneNumber: "0597801611", email: "ibrahim@gmail.com", role: "admin", staffMemberId: "748596" });
    return res.status(201).json({
        status: 201, msg: "staff member added successfully", data: {
            staffMember: newStaff
        }
    });
}
