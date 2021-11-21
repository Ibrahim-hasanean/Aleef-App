import { NextFunction, Request, Response } from "express";
import Pet, { PetsInterface } from "../../../../models/Pets";
import mongoose from "mongoose";
import User, { UserInterface } from "../../../../models/User";


export const addNewPet = async (req: Request, res: Response, next: NextFunction) => {
    const { name, serialNumber, age, typeId, breedId, gender, userId } = req.body;
    let user: UserInterface = await User.findById(userId) as UserInterface;
    if (!user) {
        return res.status(400).json({ status: 400, msg: "user not found" });
    }
    let pet = await Pet.create({ user: user._id, name, serialNumber, age, type: typeId, breed: breedId, gender });
    user.pets = [...user.pets, pet._id];
    await user.save();
    return res.status(201).json({ status: 201, data: { pet } });
}

export const getPets = async (req: Request, res: Response, next: NextFunction) => {
    let { page, limit, text, userId } = req.query as { page: string, limit: string, text: string, userId: string };
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let query: any = {};
    if (text) query.name = { $regex: text, $options: "i" };
    if (userId) query.user = userId;
    const pets: PetsInterface[] = await Pet.find(query).skip(skip).limit(limitNumber)
        .populate({ path: "user", select: ['fullName', 'phoneNumber', 'email'] });
    return res.status(200).json({ status: 200, data: { pets } });
}

export const getPetById = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(200).json({ status: 200, data: { pet: null } });
    }
    const pet: PetsInterface | null = await Pet.findById(id)
        .populate({ path: "user", select: ['fullName', 'phoneNumber', 'email'] });
    return res.status(200).json({ status: 200, data: { pet } });
}

export const deletePet = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    const pet: PetsInterface | null = await Pet.findByIdAndDelete(id);
    return res.status(200).json({ status: 200, msg: "pet deleted successfully" });
}
