import { NextFunction, Request, Response } from "express";
import Pet, { PetsInterface } from "../../../../models/Pets";
import mongoose from "mongoose";
import User, { UserInterface } from "../../../../models/User";
import petsTypes, { PetsTypesInterface } from "../../../../models/PetsTypes";
import Breeds, { BreedInterface } from "../../../../models/Breed";
import uploadImageToStorage from "../../../utils/uploadFileToFirebase";
import Medacin, { PetsMedacins } from "../../../../models/Medacine";
import Vaccination, { PetsVaccination } from "../../../../models/Vaccination";
import Appointments, { AppointmentsInterface } from "../../../../models/Appointments";
import getNextVaccination from "../../../utils/getNextVaccination";


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
    const petsCount = await Pet.find(query).count();
    return res.status(200).json({ status: 200, data: { pets, petsCount, page: page || 1, limit: limit || 10, } });
}

export const getPetById = async (req: Request, res: Response, next: NextFunction) => {
    let petId = req.params.id;
    if (!mongoose.isValidObjectId(petId)) {
        return res.status(200).json({ status: 200, data: { pet: null } });
    }
    let date = new Date();
    // .populate({ path: "medacins", sort: { createdAt: "desc" } })
    const pet: PetsInterface | null = await Pet.findById(petId)
        .select(['-appointments', '-medacins'])
        .populate("type")
        .populate({ path: "vaccinations", options: { sort: { createdAt: "desc" } } })
        .populate("gender")
        .populate({ path: "user", select: ["fullName", "phoneNumber", "email"] })
        .populate("breed") as PetsInterface;

    if (!pet) return res.status(200).json({ status: 200, pet: null });
    let lastAppointments: AppointmentsInterface[] = await Appointments
        .find({ pet: petId, appointmentDate: { $lte: date } })
        .sort({ appointmentDate: "desc" })
        .limit(10).select(["service", "appointmentDate", "doctor", 'reason']).populate({
            path: "doctor",
            select: ['name', 'phoneNumber'],
        });

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
        .find({ pet: petId, date: { $gte: date } }).sort({ date: "asc" }).limit(1);
    // let nextVaccination = getNextVaccination(vaccination);

    return res.status(200).json({
        status: 200,
        data: {
            pet: {
                lastCheckUp: (appointment[0] && appointment[0].appointmentDate) || "",
                lastGrooming: (grooming[0] && grooming[0].appointmentDate) || "",
                lastPrescription: (medacin[0] && medacin[0].createdAt) || "",
                // nextVaccination: nextVaccination == "Invalid Date" ? "" : nextVaccination,
                nextVaccination: vaccination[0]?.date ?? "",
                medicalRecord: lastAppointments,
                ...pet?.toJSON(),

            }
        }
    });
}

export const deletePet = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ status: 400, msg: "pet not found" });
    }
    const pet: PetsInterface | null = await Pet.findByIdAndDelete(id);
    return res.status(200).json({ status: 200, msg: "pet deleted successfully" });
}
