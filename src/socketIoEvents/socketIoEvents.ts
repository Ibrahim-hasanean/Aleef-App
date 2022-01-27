import { Server, Socket } from "socket.io";
import Appointments, { AppointmentsInterface } from "../models/Appointments";
import { UserInterface } from "../models/User";
import { ObjectId } from "mongoose";
import Conversation, { ConversationsInterface } from "../models/Conversations";
import Messages, { MessagesInterface } from "../models/Messages";
const socketIoEvents = (io: Server) => {

    io.use((socket, next) => {
        let token = socket.handshake.auth.token;
        console.log(token);
        next();
    });

    io.on('connection', (socket: Socket) => {
        console.log("socket connect");

        socket.on("connect", () => {
            socket.emit("connect successfully")
        });

        socket.on('user-message', async (data: any) => {
            let { message, doctorId } = data as { message: string, doctorId: ObjectId };
            let user: UserInterface = socket.handshake.auth.user;
            let isThereAppointmentBetween: AppointmentsInterface | null = await Appointments.findOne({ user: user._id, doctor: doctorId });
            if (isThereAppointmentBetween) {
                let isConversationExist: ConversationsInterface = await Conversation.findOne({ doctorId, userId: user._id }) as ConversationsInterface;
                if (!isConversationExist) {
                    isConversationExist = await Conversation.create({ doctorId, userId: user._id });
                }
                socket.join(String(isConversationExist._id));
                let newMessage: MessagesInterface = await Messages.create({ userId: user._id, message });
                isConversationExist.messages = [...isConversationExist.messages, newMessage._id];
                await isConversationExist.save();

            }

        });

    })
}
export default socketIoEvents;
