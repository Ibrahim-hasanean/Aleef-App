import mongoose, { Schema, ObjectId } from "mongoose";
import bcrypt from "bcrypt";
import { PetsInterface } from "./Pets";
import { ItemInterface } from "./Item";
import { AddressInterface } from "./Address";
import { CardInfoInterface } from "./CardsInfo";
import { OrdersItemsInterface } from "./OrderItems";


export interface UserInterface extends mongoose.Document {
    fullName: string,
    phoneNumber: string,
    email: string,
    code: string,
    isVerify: boolean,
    password: string,
    imageUrl: string,
    language: string,
    socialMediaLoggedIn: boolean,
    muteAllNotification: boolean,
    muteChat: boolean,
    vaccinationReminder: boolean,
    medacinReminder: boolean,
    appointmentReminder: boolean,
    isSuspend: boolean,
    payments: ObjectId[],
    pets: ObjectId[] | PetsInterface[],
    cardsInfo: ObjectId[] | CardInfoInterface[],
    orders: ObjectId[],
    wishList: string[] | ItemInterface[],
    addresses: AddressInterface[] | ObjectId[],
    itemList: OrdersItemsInterface[] | ObjectId[],
    comaprePassword(password: string): Promise<boolean>
}


const userSchema = new Schema({
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, default: "" },
    password: { type: String, required: true },
    code: { type: String },
    language: { type: String },
    isVerify: { type: Boolean, default: false },
    socialMediaLoggedIn: { type: Boolean },
    isSuspend: { type: Boolean, default: false },
    imageUrl: { type: String },
    muteAllNotification: { type: Boolean, default: false },
    muteChat: { type: Boolean, default: false },
    vaccinationReminder: { type: Boolean, default: true },
    medacinReminder: { type: Boolean, default: true },
    appointmentReminder: { type: Boolean, default: true },
    payments: { type: mongoose.Types.ObjectId, ref: "payments" },
    pets: [{ type: mongoose.Types.ObjectId, ref: "pets" }],
    cardsInfo: [{ type: mongoose.Types.ObjectId, ref: "cardInfo" }],
    orders: { type: mongoose.Types.ObjectId, ref: "orders" },
    wishList: [{ type: mongoose.Types.ObjectId, ref: "items" }],
    addresses: [{ type: mongoose.Types.ObjectId, ref: "addresses" }],
    itemList: [{ type: mongoose.Types.ObjectId, ref: "orderItems" }],
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    let user = this as UserInterface;
    if (user.isModified("password")) {
        let hashPassword = await bcrypt.hash(user.password, 12);
        user.password = hashPassword;
    }
    next();
});

userSchema.methods.comaprePassword = async function (password: string): Promise<boolean> {
    let user = this as UserInterface;
    let isEqual = await bcrypt.compare(password, user.password);
    return isEqual;
}


const User = mongoose.model<UserInterface>("users", userSchema);


export default User;

