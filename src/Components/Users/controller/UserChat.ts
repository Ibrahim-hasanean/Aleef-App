import { NextFunction, Request, Response } from "express";
import Message, { MessagesInterface } from "../../../models/Messages";
import mongoose, { ObjectId } from "mongoose";
import Conversations, { ConversationsInterface } from "../../../models/Conversations";
import { UserInterface } from "../../../models/User";
export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user;
    let { page, limit } = req.query as { page: string, limit: string, };
    let conversationId = req.params.id;
    let numberPageSize = limit ? Number(limit) : 15;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let isConversationExist = await Conversations.findOne({ _id: conversationId, userId: user._id });
    if (!isConversationExist) return res.status(400).json({ status: 400, msg: `you do not have conversation with id ${conversationId}` });
    let messages: MessagesInterface[] = await Message.find({ conversation: isConversationExist._id }).skip(skip).limit(numberPageSize);
    return res.status(200).json({ status: 200, messages });
}

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user;
    let { page, limit } = req.query;
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let conversations = await Conversations.find({ userId: user._id })
        .skip(skip)
        .limit(limitNumber)
        .select(['-messages'])
        .populate({ path: "userId", select: ['fullName', 'imageUrl', 'phoneNumber', 'email'] })
        .populate({ path: "doctorId", select: ['name', 'imageUrl', 'phoneNumber', 'email'] });
    return res.status(200).json({ status: 200, conversations });
}


export const getConversation = async (req: Request, res: Response) => {
    let id = req.params.id;
    let user: UserInterface = req.user;
    if (!mongoose.isValidObjectId(id))
        return res.status(200).json({ status: 200, data: { conversation: null } });
    let conversation: ConversationsInterface = await Conversations
        .findOne({ _id: id, userId: user._id })
        .select(['-messages'])
        .populate({ path: "userId", select: ['fullName', 'imageUrl', 'phoneNumber', 'email'] })
        .populate({ path: "doctorId", select: ['name', 'imageUrl', 'phoneNumber', 'email'] }) as ConversationsInterface;
    return res.status(200).json({ status: 200, data: { conversation } });
}



