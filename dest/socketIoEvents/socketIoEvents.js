"use strict";
// import { Server, Socket } from "socket.io";
// import Appointments, { AppointmentsInterface } from "../models/Appointments";
// import { UserInterface } from "../models/User";
// import { ObjectId } from "mongoose";
// import Conversation, { ConversationsInterface } from "../models/Conversations";
// import Messages, { MessagesInterface } from "../models/Messages";
// import verifyUser from "./verifyUserTokenSocket";
// import verifyStaff from "./verifyStaffTokenSocket";
// import { StafInterface } from "../models/Staff";
// const socketIoEvents = (io: Server) => {
//     io.use(async (socket: any, next) => {
//         try {
//             let userToken: string = socket.handshake.headers.usertoken as string;
//             let staffToken: string = socket.handshake.headers.stafftoken as string;
//             if (userToken) {
//                 let user = await verifyUser(userToken);
//                 if (user) {
//                     socket.handshake.auth.user = user;
//                     socket.id = String(user._id);
//                     next();
//                 }
//             } else if (staffToken) {
//                 let staff = await verifyStaff(staffToken);
//                 if (staff) {
//                     socket.handshake.auth.staffMember = staff;
//                     if (staff.role == "doctor")
//                         socket.id = String(staff._id);
//                     else if (staff.role == "receiption") {
//                         // socket.id = "receiptionSupport";
//                         socket.id = String(staff._id);
//                         socket.join("receiptionSupport")
//                     }
//                     else if (staff.role == "storeManager") {
//                         // socket.id = "receiptionSupport";
//                         socket.id = String(staff._id);
//                         socket.join("storeSupport")
//                     }
//                     next();
//                 }
//             } else
//                 next(new Error("token is required"));
//         } catch (error: any) {
//             next(new Error(error.message));
//         }
//     });
//     io.on('connection', (socket: Socket) => {
//         console.log("socket connect");
//         console.log(socket.id);
//         socket.on("hello", (data: any, ack: any) => {
//             console.log(data);
//             // socket.emit("hello", "connect successfully");
//             if (ack) ack({ status: 200, msg: "helllo" });
//         });
//         socket.on('user-message', async (data: any, ack: any) => {
//             try {
//                 console.log(data);
//                 let { message, doctorId } = data as { message: string, doctorId: ObjectId };
//                 let user: UserInterface = socket.handshake.auth.user;
//                 let isThereAppointmentBetween: AppointmentsInterface | null = await Appointments.findOne({ user: user._id, doctor: doctorId });
//                 if (isThereAppointmentBetween) {
//                     let isConversationExist: ConversationsInterface = await Conversation.findOne({ doctorId, userId: user._id }) as ConversationsInterface;
//                     if (!isConversationExist) {
//                         isConversationExist = await Conversation.create({ doctorId, userId: user._id });
//                     }
//                     // socket.join(String(isConversationExist._id));
//                     let newMessage: MessagesInterface = await Messages.create({ userId: user._id, message, conversation: isConversationExist._id, by: "user" });
//                     isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
//                     await isConversationExist.save();
//                     //send message to doctor
//                     io.to(String(doctorId)).emit("new-message", { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id });
//                     if (ack) {
//                         ack({ status: 200, msg: "message sent successfully" });
//                     }
//                 } else {
//                     ack({ status: 400, msg: "can not send message to doctor not have appointment with" });
//                 }
//             } catch (error: any) {
//                 console.log(error);
//                 ack({ status: 500, msg: error.message });
//             }
//         });
//         socket.on('doctor-message', async (data: any, ack: any) => {
//             try {
//                 console.log(data);
//                 let { message, userId } = data as { message: string, userId: ObjectId };
//                 let staff: StafInterface = socket.handshake.auth.staffMember;
//                 let isThereAppointmentBetween: AppointmentsInterface | null = await Appointments.findOne({ user: userId, doctor: staff._id });
//                 if (isThereAppointmentBetween) {
//                     let isConversationExist: ConversationsInterface = await Conversation.findOne({ doctorId: staff._id, userId }) as ConversationsInterface;
//                     if (!isConversationExist) {
//                         isConversationExist = await Conversation.create({ doctorId: staff._id, userId });
//                     }
//                     // socket.join(String(isConversationExist._id));
//                     let newMessage: MessagesInterface = await Messages.create({ doctorId: staff._id, message, conversation: isConversationExist._id, by: "doctor" });
//                     isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
//                     await isConversationExist.save();
//                     //send message to doctor
//                     io.to(String(userId)).emit("new-message", { message, from: staff.name, doctorId: staff._id, conversationId: isConversationExist._id });
//                     if (ack) {
//                         ack({ status: 200, msg: "message sent successfully" });
//                     }
//                 } else {
//                     ack({ status: 400, msg: "can not send message to user not have appointment with" });
//                 }
//             } catch (error: any) {
//                 console.log(error);
//                 ack({ status: 500, msg: error.message });
//             }
//         });
//         socket.on('receiption-support-message', async (data: any, ack: any) => {
//             try {
//                 let { message, userId } = data as { message: string, userId: ObjectId };
//                 let isConversationExist: ConversationsInterface = await Conversation.findOne({ receiptionSupport: true, userId }) as ConversationsInterface;
//                 if (!isConversationExist) {
//                     isConversationExist = await Conversation.create({ receiptionSupport: true, userId });
//                 }
//                 // socket.join(String(isConversationExist._id));
//                 let newMessage: MessagesInterface = await Messages.create({ by: "receiptionSupport", message, conversation: isConversationExist._id });
//                 isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
//                 await isConversationExist.save();
//                 //send message to doctor
//                 io.to(String(userId)).emit("new-message", { message, from: "receiption-support", conversationId: isConversationExist._id });
//                 if (ack) {
//                     ack({ status: 200, msg: "message sent successfully" });
//                 }
//             } catch (error: any) {
//                 console.log(error);
//                 ack({ status: 500, msg: error.message });
//             }
//         });
//         socket.on('user-receiption-message', async (data: any, ack: any) => {
//             try {
//                 let { message } = data as { message: string, };
//                 let user: UserInterface = socket.handshake.auth.user;
//                 let isConversationExist: ConversationsInterface = await Conversation.findOne({ receiptionSupport: true, userId: user._id }) as ConversationsInterface;
//                 if (!isConversationExist) {
//                     isConversationExist = await Conversation.create({ receiptionSupport: true, userId: user._id });
//                 }
//                 // socket.join(String(isConversationExist._id));
//                 let newMessage: MessagesInterface = await Messages.create({ userId: user._id, message, conversation: isConversationExist._id, by: "user" });
//                 isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
//                 await isConversationExist.save();
//                 //send message to support
//                 io.in('receiptionSupport').emit("new-message", { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id });
//                 if (ack) {
//                     ack({ status: 200, msg: "message sent successfully" });
//                 }
//             } catch (error: any) {
//                 console.log(error);
//                 ack({ status: 500, msg: error.message });
//             }
//         });
//         socket.on('store-support-message', async (data: any, ack: any) => {
//             try {
//                 let { message, userId } = data as { message: string, userId: ObjectId };
//                 let isConversationExist: ConversationsInterface = await Conversation.findOne({ storeSupport: true, userId }) as ConversationsInterface;
//                 if (!isConversationExist) {
//                     isConversationExist = await Conversation.create({ storeSupport: true, userId });
//                 }
//                 // socket.join(String(isConversationExist._id));
//                 let newMessage: MessagesInterface = await Messages.create({ by: "storeSupport", message, conversation: isConversationExist._id });
//                 isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
//                 await isConversationExist.save();
//                 //send message to doctor
//                 io.to(String(userId)).emit("new-message", { message, from: "store-support", conversationId: isConversationExist._id });
//                 if (ack) {
//                     ack({ status: 200, msg: "message sent successfully" });
//                 }
//             } catch (error: any) {
//                 console.log(error);
//                 ack({ status: 500, msg: error.message });
//             }
//         });
//         socket.on('user-store-message', async (data: any, ack: any) => {
//             try {
//                 let { message } = data as { message: string, };
//                 let user: UserInterface = socket.handshake.auth.user;
//                 let isConversationExist: ConversationsInterface = await Conversation.findOne({ storeSupport: true, userId: user._id }) as ConversationsInterface;
//                 if (!isConversationExist) {
//                     isConversationExist = await Conversation.create({ storeSupport: true, userId: user._id });
//                 }
//                 // socket.join(String(isConversationExist._id));
//                 let newMessage: MessagesInterface = await Messages.create({ userId: user._id, message, conversation: isConversationExist._id, by: "user" });
//                 isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
//                 await isConversationExist.save();
//                 //send message to support
//                 io.in('storeSupport').emit("new-message", { message, from: user.fullName, userId: user._id, conversationId: isConversationExist._id });
//                 if (ack) {
//                     ack({ status: 200, msg: "message sent successfully" });
//                 }
//             } catch (error: any) {
//                 console.log(error);
//                 ack({ status: 500, msg: error.message });
//             }
//         });
//         socket.on("disconnect", () => {
//             console.log("disconnect");
//         })
//     })
// }
// export default socketIoEvents;
