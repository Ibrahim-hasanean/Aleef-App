import { Request, Response, NextFunction } from "express";
import User, { UserInterface } from "../../../../models/User";
import mongoose, { ObjectId } from "mongoose";
import uploadImageToStorage from "../../../utils/uploadFileToFirebase";
import Appointments, { AppointmentsInterface } from "../../../../models/Appointments";
import Pets, { PetsInterface } from "../../../../models/Pets";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {

        let { page, limit, text, phoneNumber } = req.query as { page: string, limit: string, text: string, phoneNumber: string };
        const limitNumber = Number(limit) || 10;
        const skip = (Number(page || 1) - 1) * limitNumber;
        let query: any = {};
        if (text) query.fullName = { $regex: text, $options: "i" };
        if (phoneNumber) query.phoneNumber = phoneNumber;
        const users: UserInterface[] = await User.find(query)
            .sort({ createdAt: "desc" })
            .skip(skip)
            .limit(limitNumber)
            .select(['fullName', 'phoneNumber', 'email', 'isSuspend', 'imageUrl'])
            .populate({ path: "pets", select: ['name', 'age', 'serialNumber', 'imageUrl', 'imageUrl'] });
        var results = await Promise.all(users.map(async (user) => {
            let lastUsetVisit = await Appointments.find({ user: user._id }).sort({ appointmentDate: "desc" }).limit(1);
            return { lastVisit: lastUsetVisit[0] ? lastUsetVisit[0].appointmentDate : "", ...user.toJSON() }
        }));
        const usersCount = await User.find(query).count();
        // let reponseUsers = users.map(async (user: UserInterface) => {
        //     let lastUsetVisit = await Appointments.find({ user: user._id }).sort({ appointmentDate: "desc" }).limit(1);
        //     return { ...user.toJSON(), lastVisit: lastUsetVisit[0] ? lastUsetVisit[0].appointmentDate : "" }
        // })
        return res.status(200).json({ status: 200, data: { users: results, page: page || 1, limit: limit || 10, usersCount } });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ status: 500, msg: error.message })
    }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(200).json({ status: 200, data: { user: null } });
    }
    let date: Date = new Date();
    let user: UserInterface | null = await User.findById(id)
        .select(['fullName', 'phoneNumber', 'email', 'isSuspend', 'imageUrl'])
        .populate({
            path: "pets", select: ['name', 'age', 'serialNumber', 'imageUrl', 'imageUrl'], populate: {
                path: "appointments",
                options: {
                    select: ["appointmentDate"],
                    match: { appointmentDate: { $lte: date } },
                    sort: { appointmentDate: "desc" },
                    limit: 1
                },
            }
        }) as UserInterface;
    if (!user) return res.status(200).json({ status: 200, data: { user } });
    let lastUsetVisit = await Appointments.find({ user: user?._id }).sort({ appointmentDate: "desc" }).limit(1);
    let petsArray: PetsInterface[] = user.pets as PetsInterface[];
    let pets = petsArray.map((pet: PetsInterface): any => {
        let petsAppointments: AppointmentsInterface[] = pet.appointments as AppointmentsInterface[];
        let petObject = { ...pet.toJSON(), lastCheckUp: petsAppointments[0] ? petsAppointments[0].appointmentDate : "" };
        return petObject;
    });
    let userObject = { lastVisit: lastUsetVisit[0] ? lastUsetVisit[0].appointmentDate : "", ...user.toJSON(), pets }
    return res.status(200).json({ status: 200, data: { user: userObject } });
}

export const suspendUser = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ status: 400, msg: "use not found" });
    }
    let user: UserInterface = await User.findById(id) as UserInterface;
    if (!user) return res.status(400).json({ status: 400, msg: "use not found" });
    user.isSuspend = !user.isSuspend;
    await user.save();
    return res.status(200).json({ status: 200, msg: "toggle suspended successfully" });
}

export const addNewUser = async (req: Request, res: Response, next: NextFunction) => {
    let { fullName, email, phoneNumber, password } = req.body;
    let image = req.file;
    let imageUrl = image ? await uploadImageToStorage(image) : "";
    const isPhoneNumberExist: UserInterface | null = await User.findOne({ phoneNumber });
    if (isPhoneNumberExist) return res.status(409).json({ status: 409, msg: "phone number is used by other user" });
    if (email) {
        const isEmailExist: UserInterface | null = await User.findOne({ email });
        if (isEmailExist) return res.status(409).json({ status: 409, msg: "email is used by other user" });
    }
    let newUser = await User.create({ fullName, phoneNumber, password, email, imageUrl });
    return res.status(201).json({ status: 201, msg: "user created successfully", data: { user: newUser } });
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, phoneNumber, email } = req.body;
    let image = req.file;
    let imageUrl;
    if (image) imageUrl = await uploadImageToStorage(image);
    let userId = req.params.id;
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ status: 400, msg: "user not found" });
    }
    const user: UserInterface | null = await User.findById(userId);
    if (!user) return res.status(400).json({ status: 400, msg: "user not found" });
    const isPhoneNumberExist: UserInterface | null = await User.findOne({ phoneNumber });
    if (isPhoneNumberExist && isPhoneNumberExist?._id.toString() !== user._id.toString()) {
        return res.status(409).json({ status: 409, msg: "phone number is used by other user" });
    }
    const isEmailExist: UserInterface | null = await User.findOne({ email });
    if (isEmailExist && isEmailExist?._id.toString() !== user._id.toString()) {
        return res.status(409).json({ status: 409, msg: "email is used by other user" });
    }
    user.fullName = fullName;
    user.email = email;
    user.imageUrl = imageUrl ? imageUrl : user.imageUrl;
    user.phoneNumber = phoneNumber;
    await user.save();
    res.status(200).json({
        status: 200, data: {
            user
        }
    });
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let deleteUser = await User.findByIdAndDelete(id);
    return res.status(200).json({ status: 200, msg: "user deleted successfully" })
}


export const addNewUserWithPets = async (req: Request, res: Response, next: NextFunction) => {
    let { user, pets } = req.body;
    let images: any = req.files;
    let image = images["image"];
    let petsImages = images["petsImages"];
    console.log(user);
    console.log(pets);
    console.log(image);
    console.log(petsImages);
    user = JSON.parse(user);
    let { fullName, email, phoneNumber, password } = user;
    let imageUrl = image ? await uploadImageToStorage(image) : "";
    const isPhoneNumberExist: UserInterface | null = await User.findOne({ phoneNumber });
    if (isPhoneNumberExist) return res.status(409).json({ status: 409, msg: "phone number is used by other user" });
    if (email) {
        const isEmailExist: UserInterface | null = await User.findOne({ email });
        if (isEmailExist) return res.status(409).json({ status: 409, msg: "email is used by other user" });
    }
    // let newUser = await User.create({ fullName, phoneNumber, password, email, imageUrl });
    let newUser = new User({ fullName, phoneNumber, password, email, imageUrl });
    // let addPetsFunction = [];
    try {
        // for (let i = 0; i < pets.length; i++) {
        //     let pet = JSON.parse(pets[i]);
        //     // await addNewPetToUser(pet.name, pet.serialNumber, pet.age, pet.typeId, pet.breedId, pet.gender, newUser._id, petsImages[i]);
        //     uploadImagesFunctions.push(async () => await addNewPetToUser(pet.name, pet.serialNumber, pet.age, pet.typeId, pet.breedId, pet.gender, newUser._id, petsImages[i]));
        // }
        let addPetsFunction = (pets || []).map(async (petStringify: any, i: number) => {
            let pet = JSON.parse(petStringify);
            return await addNewPetToUser(pet.name, pet.serialNumber, pet.age, pet.typeId, pet.breedId, pet.gender, newUser._id, petsImages[i]);
        });

        let addedPets: PetsInterface[] = await Promise.all(addPetsFunction) as PetsInterface[];
        let petsIds: ObjectId[] = addedPets.map((x: PetsInterface) => x._id) as ObjectId[];
        newUser.pets = addedPets;
    } catch (error: any) {
        return res.status(400).json({ status: 400, msg: error.message });
    }
    await newUser.save();
    return res.status(201).json({ status: 201, msg: "user created successfully", data: { user: newUser } });
}

export const updateUserWithPets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { user, pets } = req.body;
        let userId = req.params.id;
        let images: any = req.files;
        let image = images["image"];
        let petsImages = images["petsImages"];
        user = JSON.parse(user);
        console.log(req.body)
        console.log(req.files)
        let { fullName, email, phoneNumber } = user;
        let imageUrl = image ? await uploadImageToStorage(image) : "";
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ status: 400, msg: "user not found" });
        }
        const existUser: UserInterface = await User.findById(userId).populate("pets") as UserInterface;
        if (!user) return res.status(400).json({ status: 400, msg: "user not found" });
        const isPhoneNumberExist: UserInterface | null = await User.findOne({ phoneNumber });
        if (isPhoneNumberExist && isPhoneNumberExist?._id?.toString() !== existUser._id?.toString()) {
            return res.status(409).json({ status: 409, msg: "phone number is used by other user" });
        }
        const isEmailExist: UserInterface | null = await User.findOne({ email });
        if (isEmailExist && isEmailExist?._id?.toString() !== existUser._id?.toString()) {
            return res.status(409).json({ status: 409, msg: "email is used by other user" });
        }
        existUser.fullName = fullName;
        existUser.email = email;
        existUser.imageUrl = imageUrl ? imageUrl : existUser.imageUrl;
        existUser.phoneNumber = phoneNumber;
        let addPetsFunction = (pets || []).map(async (petStringify: any, i: number) => {
            let pet = JSON.parse(petStringify);
            return await addNewPetToUser(pet.name, pet.serialNumber, pet.age, pet.typeId, pet.breedId, pet.gender, existUser._id, petsImages[i]);
        });
        let addedPets: PetsInterface[] = await Promise.all(addPetsFunction) as PetsInterface[];
        let petsIds: ObjectId[] = addedPets.map((x: PetsInterface) => x._id) as ObjectId[];
        let existingPets: PetsInterface[] = existUser.pets as PetsInterface[];
        existUser.pets = [...existingPets, ...addedPets];
        await existUser.save();
        return res.status(200).json({ status: 200, msg: "user created successfully", data: { user: existUser } });
    } catch (error: any) {
        console.log(error)
        return res.status(400).json({ status: 400, msg: error.message });
    }
}


const addNewPetToUser = async (name: string, serialNumber: string, age: string, typeId: string, breedId: string, gender: string, userId: string, image: File,): Promise<PetsInterface> => {
    let imageUrl = image ? await uploadImageToStorage(image) : "";
    let pet = await Pets.create({ user: userId, imageUrl, name, serialNumber, age, type: typeId, breed: breedId, gender });
    // user.pets = [...user.pets, pet._id];
    // await user.save();
    return pet;
}
