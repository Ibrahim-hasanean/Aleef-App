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
    let messagesCount = await Message.find({ conversation: isConversationExist._id }).count();
    let pagesNumber = Math.ceil(messagesCount / numberPageSize);
    return res.status(200).json({ status: 200, messages, pagesNumber });
}

export const getMessage = async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let message: MessagesInterface = await Message.findOne({ _id: id }) as MessagesInterface;
    return res.status(200).json({ status: 200, message });
}

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user;
    let { page, limit } = req.query;
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let conversations = await Conversations.find({ userId: user._id })
        .skip(skip)
        .limit(limitNumber)
        .populate({ path: "messages", options: { sort: { createdAt: -1 }, limit: 1 } })
        .populate({ path: "userId", select: ['fullName', 'imageUrl', 'phoneNumber', 'email', 'imageUrl'] })
        .populate({ path: "doctorId", select: ['name', 'imageUrl', 'phoneNumber', 'email', 'imageUrl'] });
    return res.status(200).json({ status: 200, conversations });
}


export const getConversation = async (req: Request, res: Response) => {
    let id = req.params.id;
    let user: UserInterface = req.user;
    if (!mongoose.isValidObjectId(id))
        return res.status(200).json({ status: 200, data: { conversation: null } });
    let conversation: ConversationsInterface = await Conversations
        .findOne({ _id: id, userId: user._id })
        .populate({ path: "messages", options: { sort: { createdAt: -1 }, limit: 1 } })
        .populate({ path: "userId", select: ['fullName', 'imageUrl', 'phoneNumber', 'email', 'imageUrl'] })
        .populate({ path: "doctorId", select: ['name', 'imageUrl', 'phoneNumber', 'email', 'imageUrl'] }) as ConversationsInterface;
    return res.status(200).json({ status: 200, data: { conversation } });
}



