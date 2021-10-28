import mongoose, { Schema, ObjectId } from "mongoose";
import { StaffRolesInterface } from "./StaffRoles";

export interface StafInterface extends mongoose.Document {
    name: string,
    staffMemberId: number,
    cardNumber: string,
    phoneNumber: string,
    email: string,
    role: ObjectId | StaffRolesInterface,
    muteChat: boolean,
    allowReceivingMessagesOutOfWorksHours: boolean,
    newOrdersNotifications: boolean,
    canceledOrdersNotifications: boolean,
    newReviewsNotifications: boolean,
    itemsAlmostOutOfStock: boolean
}

const staffSchema = new Schema({
    name: { type: String, required: true },
    cardNumber: { type: String, required: true },
    staffMemberId: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: mongoose.Types.ObjectId, ref: "staffRoles" },
    muteChat: { type: Boolean },
    allowReceivingMessagesOutOfWorksHours: { type: Boolean },
    newOrdersNotifications: { type: Boolean },
    canceledOrdersNotifications: { type: Boolean },
    newReviewsNotifications: { type: Boolean },
    itemsAlmostOutOfStock: { type: Boolean }

}, { timestamps: true });

const Staff = mongoose.model<StafInterface>("staff", staffSchema);

export default Staff;
