import { NextFunction, Request, Response } from "express";
import Pets from "../../../../models/Pets";
import mongoose from "mongoose";
import { PetsInterface } from "../../../../models/Pets";
import Vaccination, { PetsVaccination } from "../../../../models/Vaccination";


export const getPetVaccinations = async (req: Request, res: Response, next: NextFunction) => {
    let petId = req.params.id;
    if (!mongoose.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let pet: PetsInterface = await Pets.findById(petId).populate("vaccinations") as PetsInterface;
    return res.status(200).json({ status: 200, data: { vaccinations: pet?.vaccinations } });
}

export const getVaccinationById = async (req: Request, res: Response, next: NextFunction) => {
    let petId = req.params.id;
    let vaccinationId = req.params.vaccinationId;
    if (!mongoose.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let vaccination: PetsVaccination = await Vaccination.findOne({ pet: petId, _id: vaccinationId }) as PetsVaccination;
    return res.status(200).json({ status: 200, data: { vaccinations: vaccination } });
}

export const deleteVaccinationById = async (req: Request, res: Response, next: NextFunction) => {
    let petId = req.params.id;
    let vaccinationId = req.params.vaccinationId;
    if (!mongoose.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let vaccination: PetsVaccination = await Vaccination.findOne({ pet: petId, _id: vaccinationId }) as PetsVaccination;
    if (!vaccination) return res.status(200).json({ status: 200, msg: "vaccination deleted successfully" });
    await vaccination.delete();
    return res.status(200).json({ status: 200, msg: "vaccination deleted successfully" });
}

export const addVaccination = async (req: Request, res: Response, next: NextFunction) => {
    let { name, dates, repetition, notes } = req.body;
    let petId = req.params.id;
    if (!mongoose.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let pet: PetsInterface = await Pets.findById(petId).populate("vaccinations") as PetsInterface;
    if (!pet) return res.status(400).json({ status: 400, msg: "pet not found" });
    let newVaccinations: PetsVaccination = await Vaccination.create({ name, dates, pet: petId, repetition, notes });
    pet.vaccinations = [...pet.vaccinations, newVaccinations._id];
    await pet.save();
    return res.status(201).json({
        status: 201,
        msg: "vaccination added to pet  successfully",
        data: { vaccination: newVaccinations }
    });
}

export const updateVaccination = async (req: Request, res: Response, next: NextFunction) => {
    let { name, dates, repetition, notes } = req.body;
    let petId = req.params.id;
    let vaccinationId = req.params.vaccinationId;
    if (!mongoose.isValidObjectId(petId)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    let pet: PetsInterface = await Pets.findById(petId).populate("vaccinations") as PetsInterface;
    if (!pet) return res.status(400).json({ status: 400, msg: "pet not found" });
    let newVaccinations: PetsVaccination = await Vaccination.findByIdAndUpdate(vaccinationId, { name, dates, repetition, notes }) as PetsVaccination;
    return res.status(200).json({
        status: 200,
        msg: "vaccination updated to pet  successfully",
        data: { vaccination: newVaccinations }
    });
}
