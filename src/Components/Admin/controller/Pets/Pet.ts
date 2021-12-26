import { NextFunction, Request, Response } from "express";
import Pet, { PetsInterface } from "../../../../models/Pets";
import mongoose from "mongoose";
import User, { UserInterface } from "../../../../models/User";
import petsTypes, { PetsTypesInterface } from "../../../../models/PetsTypes";
import Breeds, { BreedInterface } from "../../../../models/Breed";
import uploadImageToStorage from "../../../utils/uploadFileToFirebase";


export const addNewPet = async (req: Request, res: Response, next: NextFunction) => {
    const { name, serialNumber, age, typeId, breedId, gender, userId, duerming, nutried } = req.body;
    let image = req.file;
    let imageUrl = image ? await uploadImageToStorage(image) : "";
    let user: UserInterface = await User.findById(userId) as UserInterface;
    if (!user) {
        return res.status(400).json({ status: 400, msg: "user not found" });
    }
    let pet = await Pet.create({ user: user._id, imageUrl, name, serialNumber, age, type: typeId, breed: breedId, gender, duerming, nutried });
    user.pets = [...user.pets, pet._id];
    await user.save();
    return res.status(201).json({ status: 201, data: { pet } });
}


export const updatePet = async (req: Request, res: Response, next: NextFunction) => {
    const { name, serialNumber, age, typeId, breedId, gender, duerming, nutried, userId } = req.body;
    const petId = req.params.id;
    let image = req.file;
    let imageUrl;
    if (image) imageUrl = await uploadImageToStorage(image);
    let user: UserInterface = await User.findById(userId) as UserInterface;
    if (!user) {
        return res.status(400).json({ status: 400, msg: "user not found" });
    }
    let pet: PetsInterface = await Pet.findOne({ user: user._id, _id: petId }) as PetsInterface;
    if (!pet) return res.status(400).json({ status: 400, msg: `pet with id ${petId} not found` });
    let isPetTypeExist: PetsTypesInterface = await petsTypes.findById(typeId) as PetsTypesInterface;
    if (!isPetTypeExist) return res.status(400).json({ status: 400, msg: "pet type not found" });
    let isPetBreedExist: BreedInterface = await Breeds.findById(breedId) as BreedInterface;
    if (!isPetBreedExist) return res.status(400).json({ status: 400, msg: "pet breed not found" });
    pet.name = name;
    pet.serialNumber = serialNumber;
    pet.type = typeId;
    pet.breed = breedId;
    pet.gender = gender;
    pet.duerming = duerming;
    pet.nutried = nutried;
    pet.age = age;
    pet.imageUrl = imageUrl ? imageUrl : pet.imageUrl;
    await pet.save();
    return res.status(200).json({ status: 200, data: { pet } });
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
