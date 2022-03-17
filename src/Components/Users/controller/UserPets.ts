import { NextFunction, Request, Response } from "express";
import Pets, { PetsInterface } from "../../../models/Pets";
import PetsTypes, { PetsTypesInterface } from "../../../models/PetsTypes";
import Breeds, { BreedInterface } from "../../../models/Breed";
import Appointments, { AppointmentsInterface } from "../../../models/Appointments";
import Vaccination, { PetsVaccination } from "../../../models/Vaccination";
import getNextVaccination from "../../utils/getNextVaccination";
import Medacin, { PetsMedacins } from "../../../models/Medacine";
import uploadImageToStorage from "../../utils/uploadFileToFirebase";

export const getPets = async (req: Request, res: Response, next: NextFunction) => {
    let { page, limit } = req.query;
    let numberPageSize = limit ? Number(limit) : 15;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let user = req.user;
    let date: Date = new Date();
    // .skip(skip)
    // .limit(numberPageSize)
    let pets: PetsInterface[] = await Pets.find({ user: user._id })
        .populate("type")
        .populate("gender")
        .populate("breed")
        .populate({
            path: "appointments",
            select: ["appointmentDate"],
            match: { appointmentDate: { $lte: date } },
            options: {
                sort: { appointmentDate: "desc" },
            },
            limit: 1
        }) as PetsInterface[];
    let petsObjects = pets.map((x: PetsInterface) => {
        let appoinments: AppointmentsInterface[] = x.appointments as AppointmentsInterface[];
        return ({
            lastCheckUp: (appoinments[0] && appoinments[0]?.appointmentDate) || null,
            ...x?.toObject(),
            // lastCheckUp: x.toJSON().appointments[0] && x.toJSON().appointments[0]?.appointmentDate
        })
    }
    )
    return res.status(200).json({ status: 200, data: { pets: petsObjects } });
}


export const addPets = async (req: Request, res: Response, next: NextFunction) => {
    const { name, serialNumber, age, typeId, breedId, gender, duerming, nutried } = req.body;
    let image = req.file;
    let imageUrl = image ? await uploadImageToStorage(image) : "";
    let user = req.user;
    let isPetTypeExist: PetsTypesInterface = await PetsTypes.findById(typeId) as PetsTypesInterface;
    if (!isPetTypeExist) return res.status(400).json({ status: 400, msg: "pet type not found" });
    let isPetBreedExist: BreedInterface = await Breeds.findById(breedId) as BreedInterface;
    if (!isPetBreedExist) return res.status(400).json({ status: 400, msg: "pet breed not found" });
    let pet = await Pets.create({ user: user._id, imageUrl, name, serialNumber, age, type: typeId, breed: breedId, gender, duerming, nutried });
    user.pets = [...user.pets, pet._id];
    await user.save();
    return res.status(201).json({ status: 201, data: { pet } });
}

export const updatePet = async (req: Request, res: Response, next: NextFunction) => {
    const { name, serialNumber, age, typeId, breedId, gender, duerming, nutried } = req.body;
    let image = req.file;
    let imageUrl;
    if (image) imageUrl = await uploadImageToStorage(image);
    const petId = req.params.id;
    let user = req.user;
    let pet: PetsInterface = await Pets.findOne({ user: user._id, _id: petId }) as PetsInterface;
    if (!pet) return res.status(400).json({ status: 400, msg: `pet with id ${petId} not found` });
    let isPetTypeExist: PetsTypesInterface = await PetsTypes.findById(typeId) as PetsTypesInterface;
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


export const getPetById = async (req: Request, res: Response, next: NextFunction) => {
    const petId = req.params.id;
    let user = req.user;
    let pet: PetsInterface = await Pets.findOne({ user: user._id, _id: petId })
        .populate("type")
        .populate("vaccinations")
        .populate("gender")
        .populate("breed") as PetsInterface;
    // .populate("appointments")
    if (!pet) return res.status(200).json({ status: 200, pet: null });
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

    // let vaccination: PetsVaccination[] = await Vaccination
    //     .find({ pet: petId, dates: { $elemMatch: { $gte: date } } });

    let vaccination: PetsVaccination[] = await Vaccination
        .find({ pet: petId, date: { $gte: date } }).sort({ date: "asc" }).limit(1);
    // let nextVaccination = getNextVaccination(vaccination);
    return res.status(200).json({
        status: 200,
        data: {
            pet: {
                ...pet?.toJSON(),
                lastCheckUp: (appointment[0] && appointment[0].appointmentDate) || "",
                lastGrooming: (grooming[0] && grooming[0].appointmentDate) || "",
                lastPrescription: (medacin[0] && medacin[0].createdAt) || "",
                // nextVaccination: nextVaccination == "Invalid Date" ? "" : nextVaccination
                nextVaccination: vaccination[0]?.date ?? ""
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


