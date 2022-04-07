import mongoose, { Schema, ObjectId } from "mongoose";
import bcrypt from "bcrypt";
import moment from "moment-timezone";

const dayHouresSchema = new Schema({
    from: { type: Date, default: "2021-10-25T08:00:00.882Z" },
    to: { type: Date, default: "2021-10-25T18:00:00.882Z" },
    isActive: { type: Boolean, default: true }
});


interface dayHouresInterface {
    from: Date,
    to: Date,
    isActive: boolean,
}

dayHouresSchema.set("toObject", { virtuals: true });
dayHouresSchema.set("toJSON", { virtuals: true });
// const weekenDayHouresSchema = new Schema({
//     from: { type: Date, default: "2021-10-25T08:00:00.882Z" },
//     to: { type: Date, default: "2021-10-25T18:00:00.882Z" },
//     isActive: { type: Boolean, default: false }
// });
dayHouresSchema.virtual("beginDate").get(function (this: dayHouresInterface) {
    // let dayHours: dayHouresInterface = ;
    let date = moment(this.from).tz('Asia/Qatar');
    return date.toDate().toUTCString();
    // return new Date(this.from).toString();
})
dayHouresSchema.virtual("endDate").get(function (this: dayHouresInterface) {
    // let dayHours: dayHouresInterface = this;
    let date = moment(this.to).tz('Asia/Qatar');
    return date.toDate().toUTCString();
    // return new Date(this.to).toString();
})


const workHouresSchema = new Schema({
    saturday: { type: dayHouresSchema, default: () => ({}) },
    sunday: { type: dayHouresSchema, default: () => ({}) },
    monday: { type: dayHouresSchema, default: () => ({}) },
    tuesday: { type: dayHouresSchema, default: () => ({}) },
    wednesday: { type: dayHouresSchema, default: () => ({}) },
    thursday: { type: dayHouresSchema, default: () => ({}) },
    friday: { type: dayHouresSchema, default: () => ({}) },
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
    allowReceivingNotificationsOutOfWorksHours: boolean,
    muteChatNotifications: boolean,
    // blockChats: boolean,
    newAppointmentsNotifications: boolean,
    canceledAppointmentsNotifications: boolean,
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
    licenseNumber: { type: String, default: "" },
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
    allowReceivingNotificationsOutOfWorksHours: { type: Boolean, default: false },
    muteChatNotifications: { type: Boolean, default: false },
    // blockChats: { type: Boolean, default: false },
    newAppointmentsNotifications: { type: Boolean, default: false },
    canceledAppointmentsNotifications: { type: Boolean, default: false },
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
