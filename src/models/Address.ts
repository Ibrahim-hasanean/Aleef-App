import mongoose, { Schema, ObjectId } from "mongoose";


export interface AddressInterface extends mongoose.Document {
    city: string,
    street: string,
    detailes: string,
}


const addressSchema = new Schema({
    city: { type: String },
    street: { type: String },
    detailes: { type: String },
})

const Address = mongoose.model<AddressInterface>("addresses", addressSchema);
export default Address;