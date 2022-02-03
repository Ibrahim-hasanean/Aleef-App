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
const verifyUserTokenSocket_1 = __importDefault(require("./verifyUserTokenSocket"));
const verifyStaffTokenSocket_1 = __importDefault(require("./verifyStaffTokenSocket"));
const socketIoEvents = (io) => {
    io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let userToken = socket.handshake.headers.usertoken;
            let staffToken = socket.handshake.headers.stafftoken;
            if (userToken) {
                let user = yield (0, verifyUserTokenSocket_1.default)(userToken);
                if (user) {
                    socket.handshake.auth.user = user;
                    socket.id = String(user._id);
                    next();
                }
            }
            else if (staffToken) {
                let staff = yield (0, verifyStaffTokenSocket_1.default)(staffToken);
                if (staff) {
                    socket.handshake.auth.staffMember = staff;
                    if (staff.role == "doctor")
                        socket.id = String(staff._id);
                    else if (staff.role == "receiption") {
                        // socket.id = "receiptionSupport";
                        socket.id = String(staff._id);
                        socket.join("receiptionSupport");
                    }
                    else if (staff.role == "storeManager") {
                        // socket.id = "receiptionSupport";
                        socket.id = String(staff._id);
                        socket.join("storeSupport");
                    }
                    next();
                }
            }
            else
                next(new Error("token is required"));
        }
        catch (error) {
            next(new Error(error.message));
        }
    }));
    io.on('connection', (socket) => {
        console.log("socket connect");
        console.log(socket.id);
        socket.on("hello", (data, ack) => {
            console.log(data);
            // socket.emit("hello", "connect successfully");
            if (ack)
                ack({ status: 200, msg: "helllo" });
        });
        socket.on('user-message', (data, ack) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log(data);
                let { message, doctorId } = data;
                let user = socket.handshake.auth.user;
                let isThereAppointmentBetween = yield Appointments_1.default.findOne({ user: user._id, doctor: doctorId });
                if (isThereAppointmentBetween) {
                    let isConversationExist = yield Conversations_1.default.findOne({ doctorId, userId: user._id });
                    if (!isConversationExist) {
                        isConversationExist = yield Conversations_1.default.create({ doctorId, userId: user._id });
                    }
                    // socket.join(String(isConversationExist._id));
                    let newMessage = yield Messages_1.default.create({ userId: user._id, message, conversation: isConversationExist._id, by: "user" });
                    isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
                    yield isConversationExist.save();
                    //send message to doctor
                    io.to(String(doctorId)).emit("new-message", { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id });
                    if (ack) {
                        ack({ status: 200, msg: "message sent successfully" });
                    }
                }
                else {
                    ack({ status: 400, msg: "can not send message to doctor not have appointment with" });
                }
            }
            catch (error) {
                console.log(error);
                ack({ status: 500, msg: error.message });
            }
        }));
        socket.on('doctor-message', (data, ack) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log(data);
                let { message, userId } = data;
                let staff = socket.handshake.auth.staffMember;
                let isThereAppointmentBetween = yield Appointments_1.default.findOne({ user: userId, doctor: staff._id });
                if (isThereAppointmentBetween) {
                    let isConversationExist = yield Conversations_1.default.findOne({ doctorId: staff._id, userId });
                    if (!isConversationExist) {
                        isConversationExist = yield Conversations_1.default.create({ doctorId: staff._id, userId });
                    }
                    // socket.join(String(isConversationExist._id));
                    let newMessage = yield Messages_1.default.create({ doctorId: staff._id, message, conversation: isConversationExist._id, by: "doctor" });
                    isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
                    yield isConversationExist.save();
                    //send message to doctor
                    io.to(String(userId)).emit("new-message", { message, from: staff.name, doctorId: staff._id, conversationId: isConversationExist._id });
                    if (ack) {
                        ack({ status: 200, msg: "message sent successfully" });
                    }
                }
                else {
                    ack({ status: 400, msg: "can not send message to user not have appointment with" });
                }
            }
            catch (error) {
                console.log(error);
                ack({ status: 500, msg: error.message });
            }
        }));
        socket.on('receiption-support-message', (data, ack) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let { message, userId } = data;
                let isConversationExist = yield Conversations_1.default.findOne({ receiptionSupport: true, userId });
                if (!isConversationExist) {
                    isConversationExist = yield Conversations_1.default.create({ receiptionSupport: true, userId });
                }
                // socket.join(String(isConversationExist._id));
                let newMessage = yield Messages_1.default.create({ by: "receiptionSupport", message, conversation: isConversationExist._id });
                isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
                yield isConversationExist.save();
                //send message to doctor
                io.to(String(userId)).emit("new-message", { message, from: "receiption-support", conversationId: isConversationExist._id });
                if (ack) {
                    ack({ status: 200, msg: "message sent successfully" });
                }
            }
            catch (error) {
                console.log(error);
                ack({ status: 500, msg: error.message });
            }
        }));
        socket.on('user-receiption-message', (data, ack) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let { message } = data;
                let user = socket.handshake.auth.user;
                let isConversationExist = yield Conversations_1.default.findOne({ receiptionSupport: true, userId: user._id });
                if (!isConversationExist) {
                    isConversationExist = yield Conversations_1.default.create({ receiptionSupport: true, userId: user._id });
                }
                // socket.join(String(isConversationExist._id));
                let newMessage = yield Messages_1.default.create({ userId: user._id, message, conversation: isConversationExist._id, by: "user" });
                isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
                yield isConversationExist.save();
                //send message to support
                io.in('receiptionSupport').emit("new-message", { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id });
                if (ack) {
                    ack({ status: 200, msg: "message sent successfully" });
                }
            }
            catch (error) {
                console.log(error);
                ack({ status: 500, msg: error.message });
            }
        }));
        socket.on('store-support-message', (data, ack) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let { message, userId } = data;
                let isConversationExist = yield Conversations_1.default.findOne({ storeSupport: true, userId });
                if (!isConversationExist) {
                    isConversationExist = yield Conversations_1.default.create({ storeSupport: true, userId });
                }
                // socket.join(String(isConversationExist._id));
                let newMessage = yield Messages_1.default.create({ by: "storeSupport", message, conversation: isConversationExist._id });
                isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
                yield isConversationExist.save();
                //send message to doctor
                io.to(String(userId)).emit("new-message", { message, from: "store-support", conversationId: isConversationExist._id });
                if (ack) {
                    ack({ status: 200, msg: "message sent successfully" });
                }
            }
            catch (error) {
                console.log(error);
                ack({ status: 500, msg: error.message });
            }
        }));
        socket.on('user-store-message', (data, ack) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let { message } = data;
                let user = socket.handshake.auth.user;
                let isConversationExist = yield Conversations_1.default.findOne({ storeSupport: true, userId: user._id });
                if (!isConversationExist) {
                    isConversationExist = yield Conversations_1.default.create({ storeSupport: true, userId: user._id });
                }
                // socket.join(String(isConversationExist._id));
                let newMessage = yield Messages_1.default.create({ userId: user._id, message, conversation: isConversationExist._id, by: "user" });
                isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
                yield isConversationExist.save();
                //send message to support
                io.in('storeSupport').emit("new-message", { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id });
                if (ack) {
                    ack({ status: 200, msg: "message sent successfully" });
                }
            }
            catch (error) {
                console.log(error);
                ack({ status: 500, msg: error.message });
            }
        }));
        socket.on("disconnect", () => {
            console.log("disconnect");
        });
    });
};
exports.default = socketIoEvents;
