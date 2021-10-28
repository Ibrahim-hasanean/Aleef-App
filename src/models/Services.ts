import mongoose, { Schema, ObjectId } from "mongoose";

export interface ServicesInterface extends mongoose.Document {
    name: string,
}

const servicesSchema = new Schema({
    name: { type: String, required: true }
})

const Services = mongoose.model<ServicesInterface>("services", servicesSchema);
export default Services;