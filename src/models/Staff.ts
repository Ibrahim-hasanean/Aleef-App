import mongoose, { Schema, ObjectId } from "mongoose";
import bcrypt from "bcrypt";

const dayHouresSchema = new Schema({
    from: { type: Date, default: "2021-10-25T08:00:00.882Z" },
    to: { type: Date, default: "2021-10-25T18:00:00.882Z" },
    isActive: { type: Boolean, default: true }
});

const weekenDayHouresSchema = new Schema({
    from: { type: Date, default: "2021-10-25T08:00:00.882Z" },
    to: { type: Date, default: "2021-10-25T18:00:00.882Z" },
    isActive: { type: Boolean, default: false }
});

interface dayHouresInterface {
    from: Date,
    to: Date,
    isActive: boolean
}

const workHouresSchema = new Schema({
    saturday: { type: weekenDayHouresSchema, default: () => ({}) },
    sunday: { type: dayHouresSchema, default: () => ({}) },
    monday: { type: dayHouresSchema, default: () => ({}) },
    tuesday: { type: dayHouresSchema, default: () => ({}) },
    wednesday: { type: dayHouresSchema, default: () => ({}) },
    thursday: { type: dayHouresSchema, default: () => ({}) },
    friday: { type: weekenDayHouresSchema, default: () => ({}) },
});


export interface workHouresInterface extends mongoose.Document {
    saturday: dayHouresInterface,
    sunday: dayHouresInterface,
    monday: dayHouresInterface,
    tuesday: dayHouresInterface,
    wednesday: dayHouresInterface,
    thursday: dayHouresInterface,
    friday: dayHouresInterface,
}

export interface StafInterface extends mongoose.Document {
    name: string,
    code: string,
    staffMemberId: number,
    imageUrl: string,
    cardNumber: string,
    licenseNumber: string,
    phoneNumber: string,
    email: string,
    role: string,
    muteChat: boolean,
    allowReceivingMessagesOutOfWorksHours: boolean,
    newOrdersNotifications: boolean,
    canceledOrdersNotifications: boolean,
    newReviewsNotifications: boolean,
    itemsAlmostOutOfStockNotification: boolean,
    registrationTokens: string[],
    workHoures: workHouresInterface
    comaprePassword(password: string): Promise<boolean>
}

const staffSchema = new Schema({
    name: { type: String, required: true },
    code: { type: String },
    imageUrl: { type: String },
    cardNumber: { type: String, required: true },
    licenseNumber: { type: String },
    staffMemberId: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    muteChat: { type: Boolean, default: false },
    allowReceivingMessagesOutOfWorksHours: { type: Boolean, default: false },
    newOrdersNotifications: { type: Boolean, default: false },
    canceledOrdersNotifications: { type: Boolean, default: false },
    newReviewsNotifications: { type: Boolean, default: false },
    itemsAlmostOutOfStockNotification: { type: Boolean, default: false },
    registrationTokens: [{ type: String }],
    workHoures: {
        type: workHouresSchema,
        default: () => ({})
    }

}, { timestamps: true });


// staffSchema.pre("validate", async function (next) {
//     let staff = this as StafInterface;
//     if (staff.isModified("password")) {
//         let hashPassword = await bcrypt.hash(staff.password, 12);
//         staff.password = hashPassword;
//     }
//     next();
// });


// staffSchema.methods.comaprePassword = async function (password: string): Promise<boolean> {
//     let staff = this as StafInterface;
//     let isEqual = await bcrypt.compare(password, staff.password);
//     return isEqual;
// }


const Staff = mongoose.model<StafInterface>("staff", staffSchema);

export const WorkHoures = mongoose.model<StafInterface>("workHoures", workHouresSchema);
export const dayHoures = mongoose.model<StafInterface>("dayHoures", dayHouresSchema);

export default Staff;
