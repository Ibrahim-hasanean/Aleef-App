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
const Appointments_1 = __importDefault(require("../models/Appointments"));
const Conversations_1 = __importDefault(require("../models/Conversations"));
const Messages_1 = __importDefault(require("../models/Messages"));
const socketIoEvents = (io) => {
    io.use((socket, next) => {
        let token = socket.handshake.auth.token;
        console.log(token);
        next();
    });
    io.on('connection', (socket) => {
        console.log("socket connect");
        socket.on("connect", () => {
            socket.emit("connect successfully");
        });
        socket.on('user-message', (data) => __awaiter(void 0, void 0, void 0, function* () {
            let { message, doctorId } = data;
            let user = socket.handshake.auth.user;
            let isThereAppointmentBetween = yield Appointments_1.default.findOne({ user: user._id, doctor: doctorId });
            if (isThereAppointmentBetween) {
                let isConversationExist = yield Conversations_1.default.findOne({ doctorId, userId: user._id });
                if (!isConversationExist) {
                    isConversationExist = yield Conversations_1.default.create({ doctorId, userId: user._id });
                }
                socket.join(String(isConversationExist._id));
                let newMessage = yield Messages_1.default.create({ userId: user._id, message });
                isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
                yield isConversationExist.save();
            }
        }));
    });
};
exports.default = socketIoEvents;
