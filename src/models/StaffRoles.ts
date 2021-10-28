import mongoose, { Schema, ObjectId } from "mongoose";

export interface StaffRolesInterface extends mongoose.Document {
    name: string
}

const rolesSchema = new Schema({
    name: { type: String, required: true }
});

const StaffRoles = mongoose.model("staffRoles", rolesSchema);

export default StaffRoles;

