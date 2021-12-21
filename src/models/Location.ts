import mongoose, { Schema, ObjectId } from "mongoose";

export interface LocationInterface extends mongoose.Document {
    lat: string
    long: string
}

const LocationSchema = new Schema({
    lat: { type: String },
    long: { type: String },
});

const Location = mongoose.model<LocationInterface>("location", LocationSchema);
export default Location;
