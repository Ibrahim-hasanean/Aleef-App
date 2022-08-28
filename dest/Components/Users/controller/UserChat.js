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
exports.getConversation = exports.getConversations = exports.getMessage = exports.getMessages = void 0;
const Messages_1 = __importDefault(require("../../../models/Messages"));
const mongoose_1 = __importDefault(require("mongoose"));
const Conversations_1 = __importDefault(require("../../../models/Conversations"));
const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let { page, limit } = req.query;
    let conversationId = req.params.id;
    let numberPageSize = limit ? Number(limit) : 15;
    let skip = (Number(page || 1) - 1) * numberPageSize;
    let isConversationExist = yield Conversations_1.default.findOne({ _id: conversationId, userId: user._id });
    if (!isConversationExist)
        return res.status(400).json({ status: 400, msg: `you do not have conversation with id ${conversationId}` });
    let messages = yield Messages_1.default.find({ conversation: isConversationExist._id }).skip(skip).limit(numberPageSize);
    let messagesCount = yield Messages_1.default.find({ conversation: isConversationExist._id }).count();
    let pagesNumber = Math.ceil(messagesCount / numberPageSize);
    return res.status(200).json({ status: 200, messages, pagesNumber });
});
exports.getMessages = getMessages;
const getMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let message = yield Messages_1.default.findOne({ _id: id });
    return res.status(200).json({ status: 200, message });
});
exports.getMessage = getMessage;
const getConversations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    let { page, limit } = req.query;
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let conversations = yield Conversations_1.default.find({ userId: user._id })
        .skip(skip)
        .limit(limitNumber)
        .populate({ path: "messages", options: { sort: { createdAt: -1 }, limit: 1 } })
        .populate({ path: "userId", select: ['fullName', 'imageUrl', 'phoneNumber', 'email', 'imageUrl'] })
        .populate({ path: "doctorId", select: ['name', 'imageUrl', 'phoneNumber', 'email', 'imageUrl'] });
    let receiptionConversation = yield Conversations_1.default.findOne({ receiptionSupport: true, userId: user._id });
    if (!receiptionConversation) {
        receiptionConversation = yield Conversations_1.default.create({ receiptionSupport: true, userId: user._id });
    }
    return res.status(200).json({ status: 200, conversations, receiptionConversation });
});
exports.getConversations = getConversations;
const getConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let user = req.user;
    if (!mongoose_1.default.isValidObjectId(id))
        return res.status(200).json({ status: 200, data: { conversation: null } });
    let conversation = yield Conversations_1.default
        .findOne({ _id: id, userId: user._id })
        .populate({ path: "messages", options: { sort: { createdAt: -1 }, limit: 1 } })
        .populate({ path: "userId", select: ['fullName', 'imageUrl', 'phoneNumber', 'email', 'imageUrl'] })
        .populate({ path: "doctorId", select: ['name', 'imageUrl', 'phoneNumber', 'email', 'imageUrl'] });
    return res.status(200).json({ status: 200, data: { conversation } });
});
exports.getConversation = getConversation;
