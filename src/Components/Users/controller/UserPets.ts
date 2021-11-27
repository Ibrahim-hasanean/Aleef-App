import { NextFunction, Request, Response } from "express";
import Pets, { PetsInterface } from "../../../models/Pets";
import PetsTypes from "../../../models/PetsTypes";
import Breeds from "../../../models/Breed";
import Appointments, { AppointmentsInterface } from "../../../models/Appointments";
import Vaccination, { PetsVaccination } from "../../../models/Vaccination";
import getNextVaccination from "../../utils/getNextVaccination";
import Medacin, { PetsMedacins } from "../../../models/Medacine";

export const getPets = async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user;
    let pets = await Pets.find({ user: user._id }).populate("type").populate("gender").populate("breed");
    return res.status(200).json({ status: 200, data: { pets } });
}


export const addPets = async (req: Request, res: Response, next: NextFunction) => {
    const { name, serialNumber, age, typeId, breedId, gender, duerming, nutried } = req.body;
    let user = req.user;
    let pet = await Pets.create({ user: user._id, name, serialNumber, age, type: typeId, breed: breedId, gender, duerming, nutried });
    user.pets = [...user.pets, pet._id];
    await user.save();
    return res.status(201).json({ status: 201, data: { pet } });
}

export const updatePet = async (req: Request, res: Response, next: NextFunction) => {
    const { name, serialNumber, age, typeId, breedId, gender, duerming, nutried } = req.body;
    const petId = req.params.id;
    let user = req.user;
    let pet: PetsInterface = await Pets.findOne({ user: user._id, _id: petId }) as PetsInterface;
    if (!pet) return res.status(400).json({ status: 400, msg: `pet with id ${petId} not found` });
    pet.name = name;
    pet.serialNumber = serialNumber;
    pet.type = typeId;
    pet.breed = breedId;
    pet.gender = gender;
    pet.duerming = duerming;
    pet.nutried = nutried;
    pet.age = age;
    await pet.save();
    return res.status(201).json({ status: 201, data: { pet } });
}


export const getPetById = async (req: Request, res: Response, next: NextFunction) => {
    const petId = req.params.id;
    let user = req.user;
    let pet: PetsInterface = await Pets.findOne({ user: user._id, _id: petId })
        .populate("type")
        .populate("gender")
        .populate("breed") as PetsInterface;
    // .populate("vaccinations")
    // .populate("medacins")

    let date = new Date();

    let appointment: AppointmentsInterface[] = await Appointments
        .find({ pet: petId, appointmentDate: { $lte: date } })
        .sort({ appointmentDate: "desc" })
        .limit(1);

    let grooming: AppointmentsInterface[] = await Appointments
        .find({ pet: petId, appointmentDate: { $lte: date }, service: "grooming" })
        .sort({ appointmentDate: "desc" })
        .limit(1);

    let medacin: PetsMedacins[] = await Medacin
        .find({ pet: petId })
        .sort({ createdAt: "desc" })
        .limit(1);

    let vaccination: PetsVaccination[] = await Vaccination
        .find({ pet: petId, dates: { $elemMatch: { $gte: date } } });
    let nextVaccination = getNextVaccination(vaccination);
    return res.status(200).json({
        status: 200,
        data: {
            pet: {
                ...pet.toJSON(),
                lastCheckUp: appointment[0] && appointment[0].appointmentDate,
                lastGrooming: grooming[0] && grooming[0].appointmentDate,
                lastPrescription: medacin[0] && medacin[0].createdAt,
                nextVaccination: nextVaccination
            }
        }
    });
}


export const deletePet = async (req: Request, res: Response, next: NextFunction) => {
    const petId = req.params.id;
    let user = req.user;
    let pet = await Pets.findOneAndDelete({ user: user._id, _id: petId });
    return res.status(200).json({ status: 200, data: { pet } });
}

export const getPetsTypes = async (req: Request, res: Response, next: NextFunction) => {
    let petsTypes = await PetsTypes.find({}).populate("breeds");
    return res.status(200).json({ status: 200, data: { petsTypes } });
}

export const getBreeds = async (req: Request, res: Response, next: NextFunction) => {
    let breeds = await Breeds.find({}).populate("type");
    return res.status(200).json({ status: 200, data: { breeds } });
}


