import { NextFunction, Request, Response } from "express";
import Breeds from "../../../../models/Breed";
import petsTypes, { PetsTypesInterface } from "../../../../models/PetsTypes";

export const addBreed = async (req: Request, res: Response, next: NextFunction) => {
    const { name, typeId } = req.body;
    const breed = await Breeds.create({ name, type: typeId });
    const type = await petsTypes.findById(typeId) as PetsTypesInterface;
    if (!type) return res.status(400).json({ status: 400, msg: "breed type not found" });
    type.breeds = [...type?.breeds, breed._id];
    await type?.save();
    return res.status(201).json({ status: 201, data: { breed } });
}

export const deletebreed = async (req: Request, res: Response, next: NextFunction) => {
    const breedId = req.params.id;
    const breed = await Breeds.findByIdAndDelete(breedId);
    return res.status(200).json({ status: 200, msg: "pets breed deleted successfully" });
}

export const getbreeds = async (req: Request, res: Response, next: NextFunction) => {
    const breeds = await Breeds.find({}).populate("type")
    return res.status(200).json({ status: 200, data: { breeds } });
}
