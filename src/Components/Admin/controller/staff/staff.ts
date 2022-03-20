import { NextFunction, Request, Response } from "express";
import Staff, { StafInterface, dayHoures, WorkHoures } from "../../../../models/Staff";
import mongoose from "mongoose";
import uploadImageToStorage from "../../../utils/uploadFileToFirebase";

export const addStaff = async (req: Request, res: Response, next: NextFunction) => {
    const { name, cardNumber, phoneNumber, email, role, staffMemberId, licenseNumber } = req.body;
    let staffMemeber = req.staff;
    if (staffMemeber.role === 'receiption' && role !== "doctor") {
        return res.status(400).json({ status: 400, msg: "receiption can add vets only" });
    }
    let image = req.file;
    let imageUrl = image ? await uploadImageToStorage(image) : "";
    const isPhoneNumberExist = await Staff.findOne({ phoneNumber });
    if (isPhoneNumberExist) return res.status(409).json({ status: 409, msg: "phone number is used before" });
    const isCardNumberExist = await Staff.findOne({ cardNumber });
    if (isCardNumberExist) return res.status(409).json({ status: 409, msg: "card number is used before" });
    const newStaff = await Staff.create({ name, cardNumber, phoneNumber, email, role, staffMemberId, imageUrl, licenseNumber });
    return res.status(201).json({
        status: 201, msg: "staff member added successfully", data: {
            staffMember: newStaff
        }
    });
}

export const updateStaff = async (req: Request, res: Response, next: NextFunction) => {
    const memberId = req.params.id;
    const { name, cardNumber, phoneNumber, email, role, staffMemberId, licenseNumber } = req.body;
    let staffMemeber = req.staff;
    if (staffMemeber.role === 'receiption' && role !== "doctor") {
        return res.status(400).json({ status: 400, msg: "receiption can update vets only" });
    }
    let image = req.file;
    let imageUrl;
    if (image) imageUrl = await uploadImageToStorage(image);
    let staffMember = await Staff.findById(memberId) as StafInterface;
    if (!staffMember) return res.status(400).json({ status: 400, msg: `staff member with id ${memberId} not exist` });
    const isPhoneNumberExist = await Staff.findOne({ phoneNumber });
    if (isPhoneNumberExist && String(staffMember._id) !== String(isPhoneNumberExist._id))
        return res.status(409).json({ status: 409, msg: "phone number is used before" });
    const isCardNumberExist = await Staff.findOne({ cardNumber });
    if (isCardNumberExist && String(staffMember._id) !== String(isCardNumberExist._id))
        return res.status(409).json({ status: 409, msg: "card number is used before" });
    const newStaff: StafInterface = await Staff.findById(memberId) as StafInterface;
    newStaff.name = name;
    newStaff.cardNumber = cardNumber;
    newStaff.phoneNumber = phoneNumber;
    newStaff.email = email;
    newStaff.staffMemberId = staffMemberId;
    newStaff.licenseNumber = licenseNumber;
    newStaff.role = role;
    newStaff.imageUrl = imageUrl ? imageUrl : newStaff.imageUrl;
    await newStaff.save();
    return res.status(200).json({
        status: 200, msg: "staff member updated successfully", data: {
            staffMember: newStaff
        }
    });
}

export const getStaffMemebers = async (req: Request, res: Response, next: NextFunction) => {
    let { text, cardNumber, phoneNumber, role, page, limit } = req.query;
    let staffMemeber = req.staff;
    if (staffMemeber.role === 'receiption') {
        role = "doctor";
    }
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let query: any = {};
    if (text) {
        query = { ...query, $or: [{ name: { $regex: text, $options: "i" } }, { email: { $regex: text, $options: "i" } }] }
    };
    if (cardNumber) query.cardNumber = cardNumber;
    if (phoneNumber) query.phoneNumber = phoneNumber;
    if (role) query.role = role;
    const staffMembers = await Staff.find(query).skip(skip).limit(limitNumber);
    const staffMembersCount = await Staff.find(query).count();
    return res.status(200).json({ status: 200, data: { staffMembers, page: page || 1, limit: limit || 10, staffMembersCount } });
}

export const getStaffMemeberById = async (req: Request, res: Response, next: NextFunction) => {
    const staffId = req.params.id;
    if (!mongoose.isValidObjectId(staffId))
        return res.status(200).json({ status: 200, data: { staffMember: null } });
    const staffMember = await Staff.findById(staffId);
    return res.status(200).json({ status: 200, data: { staffMember } });
}

export const deleteStaffMember = async (req: Request, res: Response, next: NextFunction) => {
    const staffId = req.params.id;
    const staffMember = await Staff.findByIdAndDelete(staffId);
    return res.status(200).json({ status: 200, msg: "staff member deleted sucessfully" });
}

export const getWorkHoures = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    if (!mongoose.isValidObjectId(id))
        return res.status(200).json({ status: 200, data: { staffMember: null } });
    let staff: StafInterface | null = await Staff.findById(id);
    return res.status(200).json({ status: 200, data: { workHoures: staff ? staff.workHoures : null } });
}


export const setWorkHoures = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let { saturday, sunday, monday, tuesday, wednesday, thursday, friday } = req.body;
    if (!mongoose.isValidObjectId(id))
        return res.status(200).json({ status: 200, data: { staffMember: null } });
    let staff: StafInterface | null = await Staff.findById(id) as StafInterface;
    if (!staff) return res.status(400).json({ status: 400, msg: "staff memeber not found" });
    let workHoures = staff?.workHoures
    workHoures.saturday = { isActive: saturday.isActive, from: saturday.from, to: saturday.to };
    workHoures.sunday = { isActive: sunday.isActive, from: sunday.from, to: sunday.to };
    workHoures.monday = { isActive: monday.isActive, from: monday.from, to: monday.to };
    workHoures.tuesday = { isActive: tuesday.isActive, from: tuesday.from, to: tuesday.to };
    workHoures.wednesday = { isActive: wednesday.isActive, from: wednesday.from, to: wednesday.to };
    workHoures.thursday = { isActive: thursday.isActive, from: thursday.from, to: thursday.to };
    workHoures.friday = { isActive: friday.isActive, from: friday.from, to: friday.to };
    staff.workHoures = workHoures;
    await staff?.save();
    return res.status(200).json({ status: 200, data: { workHoures: staff.workHoures } });
}


export const defaultAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const newStaff = await Staff.create({ name: "ibrahim", password: "123456789", cardNumber: 123456789, phoneNumber: "0597801611", email: "ibrahim@gmail.com", role: "admin", staffMemberId: "748596" });
    return res.status(201).json({
        status: 201, msg: "staff member added successfully", data: {
            staffMember: newStaff
        }
    });
}

