"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversation = exports.getConversations = exports.getMessages = void 0;
const Messages_1 = __importDefault(require("../../../../models/Messages"));
const mongoose_1 = __importDefault(require("mongoose"));
const Conversations_1 = __importDefault(require("../../../../models/Conversations"));
const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let staff = req.staff;
    let { page, limit } = req.query;
    let conversationId = req.params.id;
    let numberPageSize = limit ? Number(limit) : 15;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let query = { _id: conversationId };
    if (staff.role === "storeManager") {
        query.storeSupport = true;
    }
    else if (staff.role === "receiption") {
        query.receiptionSupport = true;
    }
    else {
        query.doctorId = staff._id;
    }
    let isConversationExist = yield Conversations_1.default.findOne(query);
    if (!isConversationExist)
        return res.status(400).json({ status: 400, msg: `you do not have conversation with id ${conversationId}` });
    let messages = yield (yield Messages_1.default.find({ conversation: isConversationExist._id }).sort({ createdAt: "desc" }).skip(skip).limit(numberPageSize)).reverse();
    return res.status(200).json({ status: 200, messages });
});
exports.getMessages = getMessages;
const getConversations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let staff = req.staff;
    let { page, limit } = req.query;
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let query = {};
    // .select(['-messages'])
    if (staff.role === "storeManager") {
        query.storeSupport = true;
    }
    else if (staff.role === "receiption") {
        query.receiptionSupport = true;
    }
    else {
        query.doctorId = staff._id;
    }
    let conversationsArray = yield Conversations_1.default.find(query)
        .skip(skip)
        .limit(limitNumber)
        .populate({ path: "userId", select: ['fullName', 'imageUrl', 'phoneNumber', 'email'] })
        .populate({ path: "messages", options: { limit: 10, sort: { createdAt: "desc" } } })
        .populate({ path: "doctorId", select: ['name', 'imageUrl', 'phoneNumber', 'email'] });
    let conversations = conversationsArray.map(conv => {
        conv.messages = conv.messages.reverse();
        return conv;
    });
    return res.status(200).json({ status: 200, conversations });
});
exports.getConversations = getConversations;
const getConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let staff = req.staff;
    if (!mongoose_1.default.isValidObjectId(id))
        return res.status(200).json({ status: 200, data: { conversation: null } });
    let query = { _id: id };
    if (staff.role === "storeManager") {
        query.storeSupport = true;
    }
    else if (staff.role === "receiption") {
        query.receiptionSupport = true;
    }
    else {
        query.doctorId = staff._id;
    }
    let conversation = yield Conversations_1.default
        .findOne(query)
        .populate({ path: "messages", options: { limit: 10, sort: { createdAt: "desc" } } })
        .populate({ path: "userId", select: ['fullName', 'imageUrl', 'phoneNumber', 'email'] })
        .populate({ path: "doctorId", select: ['name', 'imageUrl', 'phoneNumber', 'email'] });
    conversation.messages = conversation.messages.reverse();
    return res.status(200).json({ status: 200, data: { conversation } });
});
exports.getConversation = getConversation;
