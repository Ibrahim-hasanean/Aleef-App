import mongoose, { Schema, ObjectId } from "mongoose";

export interface HealthCareInterface extends mongoose.Document {
    description: string
}

const HealthCareSchema = new Schema({
    description: { type: String }
});

const HealthCare = mongoose.model<HealthCareInterface>("healthCare", HealthCareSchema);
export default HealthCare;
