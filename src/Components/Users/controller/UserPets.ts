import { NextFunction, Request, Response } from "express";
import Pets from "../../../models/Pets";
import PetsTypes from "../../../models/PetsTypes";
import Breeds from "../../../models/Breed";

export const getPets = async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user;
    let pets = await Pets.find({ user: user._id }).populate("type").populate("gender").populate("breed");
    return res.status(200).json({ status: 200, data: { pets } });
}


export const addPets = async (req: Request, res: Response, next: NextFunction) => {
    const { name, serialNumber, age, typeId, breedId, gender } = req.body;
    let user = req.user;
    let pet = await Pets.create({ user: user._id, name, serialNumber, age, type: typeId, breed: breedId, gender });
    user.pets = [...user.pets, pet._id];
    await user.save();
    return res.status(201).json({ status: 201, data: { pet } });
}

export const updatePet = async (req: Request, res: Response, next: NextFunction) => {
    const { name, serialNumber, age, typeId, breedId, gender } = req.body;
    const petId = req.params.id;
    let user = req.user;
    let pet = await Pets.findOneAndUpdate({ user: user._id, _id: petId }, { name, serialNumber, age, typeId, breedId, gender });
    return res.status(201).json({ status: 201, data: { pet } });
}


export const getPetById = async (req: Request, res: Response, next: NextFunction) => {
    const petId = req.params.id;
    let user = req.user;
    let pet = await Pets.findOne({ user: user._id, _id: petId }).populate("type").populate("gender").populate("breed");
    return res.status(200).json({ status: 200, data: { pet } });
}


export const deletePet = async (req: Request, res: Response, next: NextFunction) => {
    const petId = req.params.id;
    let user = req.user;
    let pet = await Pets.findOneAndDelete({ user: user._id, _id: petId });
    return res.status(200).json({ status: 200, data: { pet } });
}

export const getPetsTypes = async (req: Request, res: Response, next: NextFunction) => {
    let petsTypes = await PetsTypes.find({});
    return res.status(200).json({ status: 200, data: { petsTypes } });
}

export const getBreeds = async (req: Request, res: Response, next: NextFunction) => {
    let breeds = await Breeds.find({}).populate("type");
    return res.status(200).json({ status: 200, data: { breeds } });
}


