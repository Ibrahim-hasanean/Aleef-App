import { NextFunction, Request, Response } from "express";
import Message, { MessagesInterface } from "../../../../models/Messages";
import mongoose, { ObjectId } from "mongoose";
import Conversations, { ConversationsInterface } from "../../../../models/Conversations";
import { StafInterface } from "../../../../models/Staff";
import User, { UserInterface } from "../../../../models/User";
export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    let staff: StafInterface = req.staff;
    let { page, limit } = req.query as { page: string, limit: string, };
    let conversationId = req.params.id;
    let numberPageSize = limit ? Number(limit) : 15;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let query: any = { _id: conversationId };
    if (staff.role === "storeManager") {
        query.storeSupport = true;
    } else if (staff.role === "receiption") {
        query.receiptionSupport = true;
    } else {
        query.doctorId = staff._id
    }
    let isConversationExist = await Conversations.findOne(query);
    if (!isConversationExist) return res.status(400).json({ status: 400, msg: `you do not have conversation with id ${conversationId}` });
    let messages: MessagesInterface[] = await (await Message.find({ conversation: isConversationExist._id }).sort({ createdAt: "desc" }).skip(skip).limit(numberPageSize)).reverse();
    return res.status(200).json({ status: 200, messages });
}

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
    let staff: StafInterface = req.staff;
    let { page, limit } = req.query;
    let keyword: string = req.query.keyword as string;
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let query: any = {};
    if (staff.role === "storeManager") {
        query.storeSupport = true;
    } else if (staff.role === "receiption") {
        query.receiptionSupport = true;
    } else {
        query.doctorId = staff._id
    }
    if (keyword) {
        let users = await User.find({
            fullName: {
                "$regex": keyword, "$options": "i"
            }
        });
        let usersIds = users.map(x => x._id);
        query.userId = { "$in": usersIds };
    }
    let conversationsArray = await Conversations.find(query)
        .skip(skip)
        .limit(limitNumber)
        .populate({ path: "userId", select: ['fullName', 'imageUrl', 'phoneNumber', 'email'] })
        .populate({ path: "messages", options: { limit: 10, sort: { createdAt: "desc" } } })
        .populate({ path: "doctorId", select: ['name', 'imageUrl', 'phoneNumber', 'email'] });
    let conversations = conversationsArray.map(conv => {
        conv.messages = conv.messages.reverse();
        return conv;
    })
    return res.status(200).json({ status: 200, conversations });
}


export const getConversation = async (req: Request, res: Response) => {
    let id = req.params.id;
    let staff: StafInterface = req.staff;
    if (!mongoose.isValidObjectId(id))
        return res.status(200).json({ status: 200, data: { conversation: null } });
    let query: any = { _id: id };
    if (staff.role === "storeManager") {
        query.storeSupport = true;
    } else if (staff.role === "receiption") {
        query.receiptionSupport = true;
    } else {
        query.doctorId = staff._id
    }
    let conversation: ConversationsInterface = await Conversations
        .findOne(query)
        .populate({ path: "messages", options: { limit: 10, sort: { createdAt: "desc" } } })
        .populate({ path: "userId", select: ['fullName', 'imageUrl', 'phoneNumber', 'email'] })
        .populate({ path: "doctorId", select: ['name', 'imageUrl', 'phoneNumber', 'email'] }) as ConversationsInterface;
    if (conversation)
        conversation.messages = conversation.messages.reverse();
    return res.status(200).json({ status: 200, data: { conversation } });
}



