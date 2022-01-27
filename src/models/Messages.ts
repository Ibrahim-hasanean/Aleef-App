import mongoose, { Schema, ObjectId } from "mongoose";
import { ConversationsInterface } from "./Conversations";

export interface MessagesInterface extends mongoose.Document {
    message: string
    by: string
    doctorId: ObjectId
    userId: ObjectId
    conversation: ObjectId | ConversationsInterface
}

const messagesSchema = new Schema({
    message: { type: String },
    by: { type: String },
    doctorId: { type: mongoose.Types.ObjectId, ref: "staff" },
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
    conversation: { type: mongoose.Types.ObjectId, ref: "conversations" },
});


const Messages = mongoose.model<MessagesInterface>("messages", messagesSchema);
export default Messages;