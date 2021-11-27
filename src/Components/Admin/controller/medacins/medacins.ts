import { NextFunction, Request, Response } from "express";
import Pets from "../../../../models/Pets";
import mongoose from "mongoose";
import { PetsInterface } from "../../../../models/Pets";
import Medacin, { PetsMedacins } from "../../../../models/Medacine";


export const getPetMedacins = async (req: Request, res: Response, next: NextFunction) => {
    let petId = req.params.id;
    if (!mongoose.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let pet: PetsInterface = await Pets.findById(petId).populate("medacins") as PetsInterface;
    return res.status(200).json({ status: 200, data: { medacins: pet?.medacins } });
}

export const getMedacinById = async (req: Request, res: Response, next: NextFunction) => {
    let petId = req.params.id;
    let medacinId = req.params.medacinId;
    if (!mongoose.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let medacin: PetsMedacins = await Medacin.findOne({ pet: petId, _id: medacinId });
    return res.status(200).json({ status: 200, data: { medacin: medacin } });
}

export const deleteMedacin = async (req: Request, res: Response, next: NextFunction) => {
    let petId = req.params.id;
    let medacinId = req.params.medacinId;
    if (!mongoose.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let medacin: PetsMedacins = await Medacin.findOne({ pet: petId, _id: medacinId });
    if (!medacin) return res.status(200).json({ status: 200, msg: "medacin deleted successfully" });
    await medacin.delete();
    return res.status(200).json({ status: 200, msg: "medacin deleted successfully" });
}

export const addMedacin = async (req: Request, res: Response, next: NextFunction) => {
    let { name, duration, repetition, notes } = req.body;
    let petId = req.params.id;
    if (!mongoose.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let pet: PetsInterface = await Pets.findById(petId).populate("vaccinations") as PetsInterface;
    if (!pet) return res.status(400).json({ status: 400, msg: "pet not found" });
    let newMedacin: PetsMedacins = await Medacin.create({ name, duration, pet: petId, repetition, notes });
    pet.medacins = [...pet.medacins, newMedacin._id];
    await pet.save();
    return res.status(201).json({
        status: 201,
        msg: "medacin added to pet  successfully",
        data: { medacin: newMedacin }
    });
}

export const updateMedacin = async (req: Request, res: Response, next: NextFunction) => {
    let { name, duration, repetition, notes } = req.body;
    let petId = req.params.id;
    let medacinId = req.params.medacinId;
    if (!mongoose.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let pet: PetsInterface = await Pets.findById(petId).populate("vaccinations") as PetsInterface;
    if (!pet) return res.status(400).json({ status: 400, msg: "pet not found" });
    let newVaccinations: PetsMedacins = await Medacin.findByIdAndUpdate(medacinId, { name, duration, repetition, notes });
    return res.status(200).json({
        status: 200,
        msg: "vaccination updated to pet  successfully",
        data: { vaccination: newVaccinations }
    });
}
