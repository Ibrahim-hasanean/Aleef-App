import mongoose, { Schema, ObjectId } from "mongoose";
import { MessagesInterface } from "./Messages";
import { StafInterface } from "./Staff";
import { UserInterface } from "./User";

export interface ConversationsInterface extends mongoose.Document {
    messages: ObjectId[] | MessagesInterface[]
    doctorId: ObjectId | StafInterface
    userId: ObjectId | UserInterface
    support: boolean
}


const conversationSchema = new Schema({
    messages: [{ type: mongoose.Types.ObjectId, ref: "messages" }],
    doctorId: { type: mongoose.Types.ObjectId, ref: "staff" },
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
    support: { type: Boolean }
});

const Conversation = mongoose.model<ConversationsInterface>("conversations", conversationSchema);
export default Conversation;