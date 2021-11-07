import mongoose, { Schema, ObjectId } from "mongoose";
import bcrypt from "bcrypt";


export interface StafInterface extends mongoose.Document {
    name: string,
    password: string,
    staffMemberId: number,
    cardNumber: string,
    phoneNumber: string,
    email: string,
    role: string,
    muteChat: boolean,
    allowReceivingMessagesOutOfWorksHours: boolean,
    newOrdersNotifications: boolean,
    canceledOrdersNotifications: boolean,
    newReviewsNotifications: boolean,
    itemsAlmostOutOfStockNotification: boolean,
    comaprePassword(password: string): Promise<boolean>
}

const staffSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    cardNumber: { type: String, required: true },
    staffMemberId: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    muteChat: { type: Boolean },
    allowReceivingMessagesOutOfWorksHours: { type: Boolean },
    newOrdersNotifications: { type: Boolean },
    canceledOrdersNotifications: { type: Boolean },
    newReviewsNotifications: { type: Boolean },
    itemsAlmostOutOfStockNotification: { type: Boolean },

}, { timestamps: true });


staffSchema.pre("validate", async function (next) {
    let staff = this as StafInterface;
    if (staff.isModified("password")) {
        let hashPassword = await bcrypt.hash(staff.password, 12);
        staff.password = hashPassword;
    }
    next();
});


staffSchema.methods.comaprePassword = async function (password: string): Promise<boolean> {
    let staff = this as StafInterface;
    let isEqual = await bcrypt.compare(password, staff.password);
    return isEqual;
}


const Staff = mongoose.model<StafInterface>("staff", staffSchema);

export default Staff;
