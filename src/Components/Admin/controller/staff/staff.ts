import { NextFunction, Request, Response } from "express";
import Staff, { StafInterface, dayHoures, WorkHoures } from "../../../../models/Staff";
import mongoose from "mongoose";
import uploadImageToStorage from "../../../utils/uploadFileToFirebase";

export const addStaff = async (req: Request, res: Response, next: NextFunction) => {
    let { name, cardNumber, phoneNumber, email, role, staffMemberId, licenseNumber, workHoures } = req.body;
    workHoures = JSON.parse(workHoures);
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
    const newStaff = new Staff({ name, cardNumber, phoneNumber, email, role, staffMemberId, imageUrl, licenseNumber });
    if (role === "doctor") {
        let doctorWorkHoures = newStaff?.workHoures;
        doctorWorkHoures.saturday = { isActive: workHoures.saturday.isActive, from: workHoures.saturday.beginDate, to: workHoures.saturday.endDate };
        doctorWorkHoures.sunday = { isActive: workHoures.sunday.isActive, from: workHoures.sunday.beginDate, to: workHoures.sunday.endDate };
        doctorWorkHoures.monday = { isActive: workHoures.monday.isActive, from: workHoures.monday.beginDate, to: workHoures.monday.endDate };
        doctorWorkHoures.tuesday = { isActive: workHoures.tuesday.isActive, from: workHoures.tuesday.beginDate, to: workHoures.tuesday.endDate };
        doctorWorkHoures.wednesday = { isActive: workHoures.wednesday.isActive, from: workHoures.wednesday.beginDate, to: workHoures.wednesday.endDate };
        doctorWorkHoures.thursday = { isActive: workHoures.thursday.isActive, from: workHoures.thursday.beginDate, to: workHoures.thursday.endDate };
        doctorWorkHoures.friday = { isActive: workHoures.friday.isActive, from: workHoures.friday.beginDate, to: workHoures.friday.endDate };
        newStaff.workHoures = doctorWorkHoures;
    }
    await newStaff.save();
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
    let staffMemeber = req.staff;
    if (!mongoose.isValidObjectId(staffId))
        return res.status(200).json({ status: 200, data: { staffMember: null } });
    let query: any = { _id: staffId };
    if (staffMemeber.role === 'receiption') {
        query.role = "doctor"
    }
    const staffMember = await Staff.findOne(query);
    return res.status(200).json({ status: 200, data: { staffMember } });
}

export const deleteStaffMember = async (req: Request, res: Response, next: NextFunction) => {
    const staffId = req.params.id;
    let staffMemeber = req.staff;
    if (!mongoose.isValidObjectId(staffId))
        return res.status(200).json({ status: 200, data: { staffMember: null } });
    let query: any = { _id: staffId };
    if (staffMemeber.role === 'receiption') {
        query.role = "doctor"
    }
    const staffMember = await Staff.findOneAndDelete(query);
    return res.status(200).json({ status: 200, msg: "staff member deleted sucessfully" });
}

export const getWorkHoures = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let staffMemeber = req.staff;
    if (staffMemeber.role !== "admin" && staffMemeber.role !== "receiption" && staffMemeber._id != id) {
        return res.status(400).json({ status: 400, msg: "not allow to see other memebers workhoures" });
    }
    if (!mongoose.isValidObjectId(id))
        return res.status(200).json({ status: 200, data: { staffMember: null } });
    let query: any = { _id: id };
    if (staffMemeber.role === 'receiption') {
        query.role = "doctor"
    }
    let staff: StafInterface | null = await Staff.findOne(query);
    return res.status(200).json({ status: 200, data: { workHoures: staff ? staff.workHoures : null } });
}


export const setWorkHoures = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let staffMemeber = req.staff;
    let { saturday, sunday, monday, tuesday, wednesday, thursday, friday } = req.body;
    if (staffMemeber.role !== "admin" && staffMemeber.role !== "receiption" && staffMemeber._id != id) {
        return res.status(400).json({ status: 400, msg: "not allow to set other memebers workhoures" });
    }
    if (!mongoose.isValidObjectId(id))
        return res.status(200).json({ status: 200, data: { staffMember: null } });
    let query: any = { _id: id };
    if (staffMemeber.role === 'receiption') {
        query.role = "doctor"
    }
    let staff: StafInterface | null = await Staff.findOne(query) as StafInterface;
    if (!staff) return res.status(400).json({ status: 400, msg: "staff memeber not found" });
    let workHoures = staff?.workHoures;
    workHoures.saturday = { isActive: saturday.isActive, from: saturday.beginDate, to: saturday.endDate };
    workHoures.sunday = { isActive: sunday.isActive, from: sunday.beginDate, to: sunday.endDate };
    workHoures.monday = { isActive: monday.isActive, from: monday.beginDate, to: monday.endDate };
    workHoures.tuesday = { isActive: tuesday.isActive, from: tuesday.beginDate, to: tuesday.endDate };
    workHoures.wednesday = { isActive: wednesday.isActive, from: wednesday.beginDate, to: wednesday.endDate };
    workHoures.thursday = { isActive: thursday.isActive, from: thursday.beginDate, to: thursday.endDate };
    workHoures.friday = { isActive: friday.isActive, from: friday.beginDate, to: friday.endDate };
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


// workHoures.saturday = { isActive: saturday.isActive, from: saturday.from, to: saturday.to };
// workHoures.sunday = { isActive: sunday.isActive, from: sunday.from, to: sunday.to };
// workHoures.monday = { isActive: monday.isActive, from: monday.from, to: monday.to };
// workHoures.tuesday = { isActive: tuesday.isActive, from: tuesday.from, to: tuesday.to };
// workHoures.wednesday = { isActive: wednesday.isActive, from: wednesday.from, to: wednesday.to };
// workHoures.thursday = { isActive: thursday.isActive, from: thursday.from, to: thursday.to };
// workHoures.friday = { isActive: friday.isActive, from: friday.from, to: friday.to };