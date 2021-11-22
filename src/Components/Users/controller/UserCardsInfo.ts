import CardInfo, { CardInfoInterface } from "../../../models/CardsInfo";
import User, { UserInterface } from "../../../models/User";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export const addCardInfo = async (req: Request, res: Response, next: NextFunction) => {
    let { cardNumber, cardHolderName } = req.body;
    let user: UserInterface = req.user;
    let cardInfo: CardInfoInterface = await CardInfo.create({ cardNumber, cardHolderName, user: user._id });
    user.cardsInfo = [...user.cardsInfo, cardInfo._id];
    await user.save();
    return res.status(201).json({ status: 201, data: { card: cardInfo } });
}

export const getCardInfo = async (req: Request, res: Response, next: NextFunction) => {
    let user: UserInterface = await req.user.populate("cardsInfo");
    return res.status(200).json({ status: 200, data: { card: user.cardsInfo } });
}

export const deleteCardInfo = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let user: UserInterface = req.user;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ status: 400, msg: `there is not card number with id ${id}` });
    }
    const deleteCardNumber = await CardInfo.findByIdAndDelete(id);
    return res.status(200).json({ status: 200, mg: "card info deleted successfully", data: { card: deleteCardNumber } });
}

export const getCardInfoById = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let user: UserInterface = req.user;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ status: 400, msg: `there is not card number with id ${id}` });
    }
    const card = await CardInfo.findById(id);
    return res.status(200).json({ status: 200, data: { card } });
}




