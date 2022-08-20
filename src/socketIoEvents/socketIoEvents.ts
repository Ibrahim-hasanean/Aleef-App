import { Server, Socket } from "socket.io";
import Appointments, { AppointmentsInterface } from "../models/Appointments";
import User, { UserInterface } from "../models/User";
import { ObjectId } from "mongoose";
import Conversation, { ConversationsInterface } from "../models/Conversations";
import Messages, { MessagesInterface } from "../models/Messages";
import verifyUser from "./verifyUserTokenSocket";
import verifyStaff from "./verifyStaffTokenSocket";
import Staff, { StafInterface } from "../models/Staff";
import sendNotifications from "../Components/utils/SendNotifications";

let usersArray: string[] = [];
let doctorsArray: string[] = [];
let receiptionSupportArray: string[] = [];
let storeSupportArray: string[] = [];
const socketIoEvents = (io: Server) => {

    io.use(async (socket: any, next) => {
        try {
            let userToken: string = socket.handshake.query.usertoken as string;
            let staffToken: string = socket.handshake.query.stafftoken as string;
            console.log("check tokennn", staffToken);
            console.log("userTokennnnnn", userToken);
            if (userToken) {
                let user = await verifyUser(userToken);
                if (user) {
                    socket.handshake.auth.user = user;
                    socket.id = String(user._id);
                    socket.handshake.auth.role = "user";
                    usersArray = [... new Set([...usersArray, String(socket.id)])];
                    next();
                } else {
                    next(new Error("unauthorize"));
                }
            } else if (staffToken) {
                let staff = await verifyStaff(staffToken);
                if (staff) {
                    socket.handshake.auth.staffMember = staff;
                    socket.id = String(staff._id);
                    if (staff.role == "doctor") {
                        doctorsArray = [... new Set([...doctorsArray, String(socket.id)])];
                        socket.handshake.auth.role = "doctor";
                    }
                    else if (staff.role == "receiption") {
                        // socket.id = "receiptionSupport";
                        socket.join("receiptionSupport");
                        socket.handshake.auth.role = "receiption";
                        receiptionSupportArray = [... new Set([...receiptionSupportArray, String(socket.id)])];
                    }
                    else if (staff.role == "storeManager") {
                        // socket.id = "receiptionSupport";                       
                        socket.join("storeSupport")
                        socket.handshake.auth.role = "store";
                        storeSupportArray = [... new Set([...storeSupportArray, String(socket.id)])]
                    }
                    next();
                } else next(new Error("unauthorize"));
            } else {
                next(new Error("token is required"));
                // next();
            }
        } catch (error: any) {
            next(new Error(error.message));
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log("socket connect");
        console.log(socket.handshake.auth.role);
        console.log(usersArray);
        console.log(doctorsArray);
        console.log(receiptionSupportArray);
        console.log(storeSupportArray);
        socket.on("hello", (data: any, ack: any) => {
            console.log(data);
            socket.emit("hello", "helllo");
            // if (ack) ack?.({ status: 200, msg: "helllo" });
        });

        //user new message to doctor
        socket.on('user-doctor-message', async (data: any, ack: any) => {
            try {
                let { message, doctorId } = data as { message: string, doctorId: ObjectId };
                console.log(message);
                let user: UserInterface = socket.handshake.auth.user;
                let isThereAppointmentBetween: AppointmentsInterface | null = await Appointments.findOne({ user: user._id, doctor: doctorId });
                if (isThereAppointmentBetween) {
                    let isConversationExist: ConversationsInterface = await Conversation.findOne({ doctorId, userId: user._id }) as ConversationsInterface;
                    if (!isConversationExist) {
                        isConversationExist = await Conversation.create({ doctorId, userId: user._id });
                    }
                    let newMessage: MessagesInterface = await Messages.create({ userId: user._id, message, conversation: isConversationExist._id, by: "user" });
                    // isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
                    isConversationExist.messages.push(newMessage._id);
                    await isConversationExist.save();
                    //send message to doctor
                    let isOnline = doctorsArray.find(x => x == String(doctorId));
                    if (isOnline) io.to(String(doctorId)).emit("new-message", { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id });
                    else {
                        let doctor: StafInterface = await Staff.findById(doctorId) as StafInterface;
                        sendNotifications(doctor.registrationTokens, {
                            title: "new message",
                            body: { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id }
                        });
                    }
                    if (ack) {
                        ack?.({ status: 200, msg: "message sent successfully" });
                    }
                } else {
                    ack?.({ status: 400, msg: "can not send message to doctor not have appointment with" });
                }
            } catch (error: any) {
                console.log(error);
                ack?.({ status: 500, msg: error.message });

            }
        });

        //doctor new message to user
        socket.on('doctor-message', async (data: any, ack: any) => {
            try {
                console.log(data);
                let { message, userId } = data as { message: string, userId: ObjectId };
                let staff: StafInterface = socket.handshake.auth.staffMember;
                let isThereAppointmentBetween: AppointmentsInterface | null = await Appointments.findOne({ user: userId, doctor: staff._id });
                if (isThereAppointmentBetween) {
                    let isConversationExist: ConversationsInterface = await Conversation.findOne({ doctorId: staff._id, userId }) as ConversationsInterface;
                    if (!isConversationExist) {
                        isConversationExist = await Conversation.create({ doctorId: staff._id, userId });
                    }
                    // socket.join(String(isConversationExist._id));
                    let newMessage: MessagesInterface = await Messages.create({ doctorId: staff._id, message, conversation: isConversationExist._id, by: "doctor" });
                    isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
                    await isConversationExist.save();
                    //send message to doctor
                    let isOnline = usersArray.find(x => x == String(userId));
                    if (isOnline) io.to(String(userId)).emit("new-message", { message, from: staff.name, doctorId: staff._id, conversationId: isConversationExist._id });
                    else {
                        let user: UserInterface = await User.findById(userId) as UserInterface;
                        let registrationTokens = user.registrationTokens.filter(x => Boolean(x) != false)
                        sendNotifications(registrationTokens, {
                            title: "new message",
                            body: JSON.stringify({ message, from: staff.name, doctorId: staff._id, conversationId: isConversationExist._id })
                        });
                    }
                    if (ack) {
                        ack?.({ status: 200, msg: "message sent successfully" });
                    }
                } else {
                    console.log("has nooo appointment");
                    ack?.({ status: 400, msg: "can not send message to user not have appointment with" });

                }
            } catch (error: any) {
                console.log(error);
                ack?.({ status: 500, msg: error.message });
            }
        });
        // reciption support new message to user
        socket.on('receiption-support-message', async (data: any, ack: any) => {
            try {
                let { message, userId } = data as { message: string, userId: ObjectId };
                let isConversationExist: ConversationsInterface = await Conversation.findOne({ receiptionSupport: true, userId }) as ConversationsInterface;
                if (!isConversationExist) {
                    isConversationExist = await Conversation.create({ receiptionSupport: true, userId });
                }
                // socket.join(String(isConversationExist._id));
                let newMessage: MessagesInterface = await Messages.create({ by: "receiptionSupport", message, conversation: isConversationExist._id });
                isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
                await isConversationExist.save();
                //send message to doctor
                let isOnline = usersArray.find(x => x == String(userId));
                if (isOnline) io.to(String(userId)).emit("new-receiption-support-message", { message, conversationId: isConversationExist._id });
                else {
                    let user: UserInterface = await User.findById(userId) as UserInterface;
                    sendNotifications(user.registrationTokens, {
                        title: "new message",
                        body: { message, from: "receiption-support", conversationId: isConversationExist._id }
                    });
                }
                if (ack) {
                    ack?.({ status: 200, msg: "message sent successfully" });
                }
            } catch (error: any) {
                console.log(error);
                ack?.({ status: 500, msg: error.message });
            }
        });
        //user new message to  reciption support
        socket.on('user-receiption-message', async (data: any, ack: any) => {
            try {
                let { message } = data as { message: string, };
                let user: UserInterface = socket.handshake.auth.user;
                let isConversationExist: ConversationsInterface = await Conversation.findOne({ receiptionSupport: true, userId: user._id }) as ConversationsInterface;
                if (!isConversationExist) {
                    isConversationExist = await Conversation.create({ receiptionSupport: true, userId: user._id });
                }
                // socket.join(String(isConversationExist._id));
                let newMessage: MessagesInterface = await Messages.create({ userId: user._id, message, conversation: isConversationExist._id, by: "user" });
                isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
                await isConversationExist.save();
                //send message to support
                let isThereSupportOnline = receiptionSupportArray.length > 0;
                if (isThereSupportOnline) io.in('receiptionSupport').emit("new-message", { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id });
                else {
                    const receptionSupportMemebers: StafInterface[] = await Staff.find({ role: "receiption" });
                    let receptionSupportMemebersTokens: string[] = receptionSupportMemebers.map(x => x.registrationTokens).flat();
                    await sendNotifications(receptionSupportMemebersTokens, {
                        title: "new message",
                        body: { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id }
                    })
                }
                if (ack) {
                    ack?.({ status: 200, msg: "message sent successfully" });
                }
            } catch (error: any) {
                console.log(error);
                ack?.({ status: 500, msg: error.message });

            }
        });
        //store support new message to user
        socket.on('store-support-message', async (data: any, ack: any) => {
            try {
                let { message, userId } = data as { message: string, userId: ObjectId };
                let isConversationExist: ConversationsInterface = await Conversation.findOne({ storeSupport: true, userId }) as ConversationsInterface;
                if (!isConversationExist) {
                    isConversationExist = await Conversation.create({ storeSupport: true, userId });
                }
                // socket.join(String(isConversationExist._id));
                let newMessage: MessagesInterface = await Messages.create({ by: "storeSupport", message, conversation: isConversationExist._id });
                isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
                await isConversationExist.save();
                //send message to doctor
                let isOnline = usersArray.find(x => x == String(userId));
                if (isOnline) io.to(String(userId)).emit("new-store-support-message", { message, conversationId: isConversationExist._id });
                else {
                    let user: UserInterface = await User.findById(userId) as UserInterface;
                    sendNotifications(user.registrationTokens, {
                        title: "new message",
                        body: { message, from: "store-support", conversationId: isConversationExist._id }
                    });
                }
                if (ack) {
                    ack?.({ status: 200, msg: "message sent successfully" });
                }
            } catch (error: any) {
                console.log(error);
                ack?.({ status: 500, msg: error.message });
            }
        });
        //user new message to store support
        socket.on('user-store-message', async (data: any, ack: any) => {
            try {
                let { message } = data as { message: string, };
                let user: UserInterface = socket.handshake.auth.user;
                let isConversationExist: ConversationsInterface = await Conversation.findOne({ storeSupport: true, userId: user._id }) as ConversationsInterface;
                if (!isConversationExist) {
                    isConversationExist = await Conversation.create({ storeSupport: true, userId: user._id });
                }
                // socket.join(String(isConversationExist._id));
                let newMessage: MessagesInterface = await Messages.create({ userId: user._id, message, conversation: isConversationExist._id, by: "user" });
                isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
                await isConversationExist.save();
                //send message to support
                let isThereSupportOnline = storeSupportArray.length > 0;
                if (isThereSupportOnline) io.in('receiptionSupport').emit("new-message", { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id });
                else {
                    const storeSupportMemebers: StafInterface[] = await Staff.find({ role: "storeManager" });
                    let storeSupportMemebersTokens: string[] = storeSupportMemebers.map(x => x.registrationTokens).flat();
                    await sendNotifications(storeSupportMemebersTokens, {
                        title: "new message",
                        body: { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id }
                    })
                }
                if (ack) {
                    ack?.({ status: 200, msg: "message sent successfully" });
                }
            } catch (error: any) {
                console.log(error);
                ack?.({ status: 500, msg: error.message });

            }
        });

        socket.on("disconnect", () => {
            let role = socket.handshake.auth.role;
            let socketId = socket.id
            if (role == "user") {
                usersArray = usersArray.filter(x => x != socketId);
            } else if (role == "doctor") {
                doctorsArray = doctorsArray.filter(x => x != socketId);
            } else if (role == "receiption") {
                receiptionSupportArray = receiptionSupportArray.filter(x => x != socketId);
            } else if (role == "store") {
                storeSupportArray = storeSupportArray.filter(x => x != socketId);
            }
            console.log("disconnect");
        })

    })
}
export default socketIoEvents;
