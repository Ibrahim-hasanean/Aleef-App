import mongoose, { Schema, ObjectId } from "mongoose";
import { StafInterface } from "./Staff";
import { UserInterface } from "./User";

export interface NotificationsInterface extends mongoose.Document {
    title: string
    body: string
    user: ObjectId | UserInterface | null
    staffMemeber: ObjectId | StafInterface | null
}

const notificationsSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    staffMemeber: { type: mongoose.Types.ObjectId, ref: "staff" },
});

const Notification = mongoose.model("notification", notificationsSchema);
export default Notification;