import mongoose, { Schema, ObjectId } from "mongoose";

export interface ReadAboutInterface extends mongoose.Document {
    description: string
}

const ReadAboutSchema = new Schema({
    description: { type: String }
});

const ReadAbout = mongoose.model<ReadAboutInterface>("readaboute", ReadAboutSchema);
export default ReadAbout;
