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
    let isConversationExist = yield Conversations_1.default.findOne({ _id: conversationId, doctorId: staff._id });
    if (!isConversationExist)
        return res.status(400).json({ status: 400, msg: `you do not have conversation with id ${conversationId}` });
    let messages = yield Messages_1.default.find({ conversation: isConversationExist._id }).skip(skip).limit(numberPageSize);
    return res.status(200).json({ status: 200, messages });
});
exports.getMessages = getMessages;
const getConversations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let staff = req.staff;
    let { page, limit } = req.query;
    const limitNumber = Number(limit) || 10;
    const skip = (Number(page || 1) - 1) * limitNumber;
    let conversations = yield Conversations_1.default.find({ doctorId: staff._id })
        .skip(skip)
        .limit(limitNumber)
        .select(['-messages'])
        .populate({ path: "userId", select: ['fullName', 'imageUrl', 'phoneNumber', 'email'] })
        .populate({ path: "doctorId", select: ['name', 'imageUrl', 'phoneNumber', 'email'] });
    return res.status(200).json({ status: 200, conversations });
});
exports.getConversations = getConversations;
const getConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let staff = req.staff;
    if (!mongoose_1.default.isValidObjectId(id))
        return res.status(200).json({ status: 200, data: { conversation: null } });
    let conversation = yield Conversations_1.default
        .findOne({ _id: id, doctorId: staff._id })
        .select(['-messages'])
        .populate({ path: "userId", select: ['fullName', 'imageUrl', 'phoneNumber', 'email'] })
        .populate({ path: "doctorId", select: ['name', 'imageUrl', 'phoneNumber', 'email'] });
    return res.status(200).json({ status: 200, data: { conversation } });
});
exports.getConversation = getConversation;
