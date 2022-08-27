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
const User_1 = __importDefault(require("../models/User"));
const Conversations_1 = __importDefault(require("../models/Conversations"));
const Messages_1 = __importDefault(require("../models/Messages"));
const verifyUserTokenSocket_1 = __importDefault(require("./verifyUserTokenSocket"));
const verifyStaffTokenSocket_1 = __importDefault(require("./verifyStaffTokenSocket"));
const Staff_1 = __importDefault(require("../models/Staff"));
const SendNotifications_1 = __importDefault(require("../Components/utils/SendNotifications"));
let usersArray = [];
let doctorsArray = [];
let receiptionSupportArray = [];
let storeSupportArray = [];
const socketIoEvents = (io) => {
    io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let userToken = socket.handshake.query.usertoken;
            let staffToken = socket.handshake.query.stafftoken;
            console.log("check tokennn", staffToken);
            console.log("userTokennnnnn", userToken);
            if (userToken) {
                let user = yield (0, verifyUserTokenSocket_1.default)(userToken);
                if (user) {
                    socket.handshake.auth.user = user;
                    socket.id = String(user._id);
                    socket.handshake.auth.role = "user";
                    usersArray = [...new Set([...usersArray, String(socket.id)])];
                    next();
                }
                else {
                    next(new Error("unauthorize"));
                }
            }
            else if (staffToken) {
                let staff = yield (0, verifyStaffTokenSocket_1.default)(staffToken);
                if (staff) {
                    socket.handshake.auth.staffMember = staff;
                    socket.id = String(staff._id);
                    if (staff.role == "doctor") {
                        doctorsArray = [...new Set([...doctorsArray, String(socket.id)])];
                        socket.handshake.auth.role = "doctor";
                    }
                    else if (staff.role == "receiption") {
                        // socket.id = "receiptionSupport";
                        socket.join("receiptionSupport");
                        socket.handshake.auth.role = "receiption";
                        receiptionSupportArray = [...new Set([...receiptionSupportArray, String(socket.id)])];
                    }
                    else if (staff.role == "storeManager") {
                        // socket.id = "receiptionSupport";                       
                        socket.join("storeSupport");
                        socket.handshake.auth.role = "store";
                        storeSupportArray = [...new Set([...storeSupportArray, String(socket.id)])];
                    }
                    next();
                }
                else
                    next(new Error("unauthorize"));
            }
            else {
                next(new Error("token is required"));
                // next();
            }
        }
        catch (error) {
            next(new Error(error.message));
        }
    }));
    io.on('connection', (socket) => {
        console.log("socket connect");
        console.log(socket.handshake.auth.role);
        console.log(usersArray);
        console.log(doctorsArray);
        console.log(receiptionSupportArray);
        console.log(storeSupportArray);
        socket.on("hello", (data, ack) => {
            console.log(data);
            socket.emit("hello", "helllo");
            // if (ack) ack?.({ status: 200, msg: "helllo" });
        });
        //user new message to doctor
        socket.on('user-doctor-message', (data, ack) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let { message, doctorId } = data;
                console.log(message);
                let user = socket.handshake.auth.user;
                let isThereAppointmentBetween = yield Appointments_1.default.findOne({ user: user._id, doctor: doctorId });
                if (isThereAppointmentBetween) {
                    let isConversationExist = yield Conversations_1.default.findOne({ doctorId, userId: user._id });
                    if (!isConversationExist) {
                        isConversationExist = yield Conversations_1.default.create({ doctorId, userId: user._id });
                    }
                    let newMessage = yield Messages_1.default.create({ userId: user._id, message, conversation: isConversationExist._id, by: "user" });
                    // isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
                    isConversationExist.messages.push(newMessage._id);
                    yield isConversationExist.save();
                    //send message to doctor
                    let isOnline = doctorsArray.find(x => x == String(doctorId));
                    if (isOnline)
                        io.to(String(doctorId)).emit("new-message", { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id });
                    else {
                        let doctor = yield Staff_1.default.findById(doctorId);
                        (0, SendNotifications_1.default)(doctor.registrationTokens, {
                            title: "new message",
                            body: { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id }
                        });
                    }
                    if (ack) {
                        ack === null || ack === void 0 ? void 0 : ack({ status: 200, msg: "message sent successfully" });
                    }
                }
                else {
                    ack === null || ack === void 0 ? void 0 : ack({ status: 400, msg: "can not send message to doctor not have appointment with" });
                }
            }
            catch (error) {
                console.log(error);
                ack === null || ack === void 0 ? void 0 : ack({ status: 500, msg: error.message });
            }
        }));
        //doctor new message to user
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
                    let isOnline = usersArray.find(x => x == String(userId));
                    console.log({ isOnline });
                    if (isOnline)
                        io.to(String(userId)).emit("new-message", { message, from: staff.name, doctorId: staff._id, conversationId: isConversationExist._id });
                    else {
                        let user = yield User_1.default.findById(userId);
                        let registrationTokens = user.registrationTokens.filter(x => Boolean(x) != false);
                        (0, SendNotifications_1.default)(registrationTokens, {
                            title: "new message",
                            body: JSON.stringify({ message, from: staff.name, doctorId: staff._id, conversationId: isConversationExist._id })
                        });
                    }
                    if (ack) {
                        ack === null || ack === void 0 ? void 0 : ack({ status: 200, msg: "message sent successfully" });
                    }
                }
                else {
                    console.log("has nooo appointment");
                    ack === null || ack === void 0 ? void 0 : ack({ status: 400, msg: "can not send message to user not have appointment with" });
                }
            }
            catch (error) {
                console.log(error);
                ack === null || ack === void 0 ? void 0 : ack({ status: 500, msg: error.message });
            }
        }));
        // reciption support new message to user
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
                let isOnline = usersArray.find(x => x == String(userId));
                if (isOnline)
                    io.to(String(userId)).emit("new-receiption-support-message", { message, conversationId: isConversationExist._id });
                else {
                    let user = yield User_1.default.findById(userId);
                    (0, SendNotifications_1.default)(user.registrationTokens, {
                        title: "new message",
                        body: { message, from: "receiption-support", conversationId: isConversationExist._id }
                    });
                }
                if (ack) {
                    ack === null || ack === void 0 ? void 0 : ack({ status: 200, msg: "message sent successfully" });
                }
            }
            catch (error) {
                console.log(error);
                ack === null || ack === void 0 ? void 0 : ack({ status: 500, msg: error.message });
            }
        }));
        //user new message to  reciption support
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
                let isThereSupportOnline = receiptionSupportArray.length > 0;
                if (isThereSupportOnline)
                    io.in('receiptionSupport').emit("new-message", { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id });
                else {
                    const receptionSupportMemebers = yield Staff_1.default.find({ role: "receiption" });
                    let receptionSupportMemebersTokens = receptionSupportMemebers.map(x => x.registrationTokens).flat();
                    yield (0, SendNotifications_1.default)(receptionSupportMemebersTokens, {
                        title: "new message",
                        body: { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id }
                    });
                }
                if (ack) {
                    ack === null || ack === void 0 ? void 0 : ack({ status: 200, msg: "message sent successfully" });
                }
            }
            catch (error) {
                console.log(error);
                ack === null || ack === void 0 ? void 0 : ack({ status: 500, msg: error.message });
            }
        }));
        //store support new message to user
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
                let isOnline = usersArray.find(x => x == String(userId));
                if (isOnline)
                    io.to(String(userId)).emit("new-store-support-message", { message, conversationId: isConversationExist._id });
                else {
                    let user = yield User_1.default.findById(userId);
                    (0, SendNotifications_1.default)(user.registrationTokens, {
                        title: "new message",
                        body: { message, from: "store-support", conversationId: isConversationExist._id }
                    });
                }
                if (ack) {
                    ack === null || ack === void 0 ? void 0 : ack({ status: 200, msg: "message sent successfully" });
                }
            }
            catch (error) {
                console.log(error);
                ack === null || ack === void 0 ? void 0 : ack({ status: 500, msg: error.message });
            }
        }));
        //user new message to store support
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
                let isThereSupportOnline = storeSupportArray.length > 0;
                if (isThereSupportOnline)
                    io.in('receiptionSupport').emit("new-message", { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id });
                else {
                    const storeSupportMemebers = yield Staff_1.default.find({ role: "storeManager" });
                    let storeSupportMemebersTokens = storeSupportMemebers.map(x => x.registrationTokens).flat();
                    yield (0, SendNotifications_1.default)(storeSupportMemebersTokens, {
                        title: "new message",
                        body: { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id }
                    });
                }
                if (ack) {
                    ack === null || ack === void 0 ? void 0 : ack({ status: 200, msg: "message sent successfully" });
                }
            }
            catch (error) {
                console.log(error);
                ack === null || ack === void 0 ? void 0 : ack({ status: 500, msg: error.message });
            }
        }));
        socket.on("disconnect", () => {
            let role = socket.handshake.auth.role;
            let socketId = socket.id;
            if (role == "user") {
                usersArray = usersArray.filter(x => x != socketId);
            }
            else if (role == "doctor") {
                doctorsArray = doctorsArray.filter(x => x != socketId);
            }
            else if (role == "receiption") {
                receiptionSupportArray = receiptionSupportArray.filter(x => x != socketId);
            }
            else if (role == "store") {
                storeSupportArray = storeSupportArray.filter(x => x != socketId);
            }
            console.log("disconnect");
        });
    });
};
exports.default = socketIoEvents;
